import asyncio
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Request, HTTPException, Form, UploadFile, File
import httpx
from app.config import settings
from app.data.outfits import OUTFITS
from app.schemas.try_on import TryOnResponse, TryOnJobStatus

logger = logging.getLogger("try-it-out.try_on")
router = APIRouter(prefix="/api/try-on", tags=["Virtual Try-On"])

# In-memory storage for virtual try-on asynchronous jobs
_jobs_store: Dict[str, Dict[str, Any]] = {}

async def generate_with_gemini_image(prompt: str, key: str) -> Optional[str]:
    """
    Attempt image generation using Google AI Studio Gemini Image models (e.g. gemini-3.1-flash-image-preview).
    Available when billing/image generation quota is enabled on the AI Studio project.
    """
    candidate_models = [
        "gemini-3.1-flash-image-preview",
        "gemini-3-pro-image-preview",
        "gemini-2.5-flash-image"
    ]
    for model in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        for part in parts:
                            inline = part.get("inlineData")
                            if inline and "data" in inline:
                                mime = inline.get("mimeType", "image/jpeg")
                                return f"data:{mime};base64,{inline['data']}"
                else:
                    logger.debug("Gemini model %s returned status %d: %s", model, resp.status_code, resp.text[:120])
        except Exception as e:
            logger.debug("Error generating image with Gemini %s: %s", model, e)
    return None

async def get_gemini_styling_advice(outfit: dict, key: str) -> Optional[str]:
    """
    Generate personalized high-fashion styling advice using Google AI Studio,
    with multi-model fallback and tailored garment styling fallback.
    """
    candidate_models = [
        "gemini-2.5-flash-lite",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite-preview",
        "gemini-flash-latest"
    ]
    prompt = (
        f"You are an elite personal fashion stylist. Give 2 concise, sophisticated sentences on styling and occasion advice "
        f"for this piece: {outfit['name']}, category: {outfit.get('category')}, fabric: {outfit.get('fabric', 'luxury fabric')}, "
        f"fit: {outfit.get('fit', 'tailored fit')}. Focus on footwear, accessories, or layering."
    )
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    for model in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"].strip()
        except Exception as e:
            logger.debug("Error getting advice from %s: %s", model, e)
            continue

    # Tailored stylistic fallback based on garment metadata
    return (
        f"Style this {outfit['name']} with minimalist accessories and complementary footwear to accentuate its {outfit.get('fit', 'tailored').lower()} silhouette. "
        f"The {outfit.get('fabric', 'premium fabric').lower()} drapes naturally, making it an effortless choice for {outfit.get('season', 'all-season').lower()} occasions."
    )

async def generate_with_openai_image(prompt: str, key: str) -> Optional[str]:
    """
    Attempt image generation using direct OpenAI DALL-E endpoint.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024"
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                if "data" in data and len(data["data"]) > 0:
                    return data["data"][0].get("url")
            else:
                logger.warning("OpenAI provider responded with code %d: %s", resp.status_code, resp.text)
    except Exception as e:
        logger.warning("Exception during OpenAI image generation: %s", e)
    return None

@router.post("", response_model=TryOnResponse)
async def generate_try_on(
    request: Request,
    outfitId: Optional[str] = Form(None),
    photoAssetId: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    selected_outfit_id = outfitId
    asset_id = photoAssetId

    if not selected_outfit_id:
        try:
            body = await request.json()
            selected_outfit_id = body.get("outfitId")
            asset_id = body.get("photoAssetId")
        except Exception:
            pass

    if not selected_outfit_id:
        raise HTTPException(status_code=400, detail="Missing required 'outfitId' parameter.")

    outfit = next((o for o in OUTFITS if o["id"] == selected_outfit_id), None)
    if not outfit:
        raise HTTPException(status_code=404, detail=f"Outfit '{selected_outfit_id}' not found.")

    job_id = f"job_{uuid.uuid4().hex[:10]}"
    timestamp = datetime.utcnow().isoformat()
    result_url = outfit["image"]
    source = "backend"
    styling_advice: Optional[str] = None

    # Check for Google AI Studio / Gemini API key
    gemini_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
    if not gemini_key and settings.IMAGE_GENERATION_API_KEY and settings.IMAGE_GENERATION_API_KEY.startswith("AQ."):
        gemini_key = settings.IMAGE_GENERATION_API_KEY

    # Check for OpenAI key
    openai_key = settings.OPENAI_API_KEY
    if not openai_key and settings.IMAGE_GENERATION_API_KEY and settings.IMAGE_GENERATION_API_KEY.startswith("sk-"):
        openai_key = settings.IMAGE_GENERATION_API_KEY

    prompt = (
        f"High-end fashion editorial portrait: A stylish model wearing {outfit['name']}, "
        f"made of {outfit.get('fabric', 'luxury fabric')}, {outfit.get('fit', 'tailored fit')}, "
        f"{outfit.get('category', 'fashion')} collection, photorealistic lighting, studio background, 8k resolution."
    )

    if gemini_key:
        # First try image generation with Gemini
        ai_img = await generate_with_gemini_image(prompt, gemini_key)
        if ai_img:
            result_url = ai_img
            source = "gemini_image"
        
        # Also fetch AI styling advice
        advice = await get_gemini_styling_advice(outfit, gemini_key)
        if advice:
            styling_advice = advice
            if source == "backend":
                source = "gemini_styled"

    elif openai_key:
        ai_img = await generate_with_openai_image(prompt, openai_key)
        if ai_img:
            result_url = ai_img
            source = "openai_image"

    # Record job status
    _jobs_store[job_id] = {
        "status": "completed",
        "resultUrl": result_url,
        "outfitId": selected_outfit_id,
        "timestamp": timestamp,
        "aiStylingAdvice": styling_advice
    }

    return TryOnResponse(
        status="success",
        resultUrl=result_url,
        jobId=job_id,
        source=source,
        timestamp=timestamp,
        aiStylingAdvice=styling_advice
    )

@router.get("/status/{job_id}", response_model=TryOnJobStatus)
async def get_job_status(job_id: str):
    job = _jobs_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Try-on job not found.")

    return TryOnJobStatus(
        status=job["status"],
        resultUrl=job.get("resultUrl"),
        error=job.get("error")
    )
