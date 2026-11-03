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

async def generate_with_ai_provider(prompt: str, key: str) -> Optional[str]:
    """
    Attempt image generation using direct API key (OpenAI DALL-E / compatible endpoint).
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
                logger.warning("AI provider responded with code %d: %s", resp.status_code, resp.text)
    except Exception as e:
        logger.warning("Exception during direct AI image generation: %s", e)
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

    # Check for direct image generation API key
    ai_key = settings.IMAGE_GENERATION_API_KEY or settings.OPENAI_API_KEY
    if ai_key:
        prompt = (
            f"High-end fashion editorial portrait: A stylish model wearing {outfit['name']}, "
            f"made of {outfit.get('fabric', 'luxury fabric')}, {outfit.get('fit', 'tailored fit')}, "
            f"{outfit.get('category', 'fashion')} collection, photorealistic lighting, studio background, 8k resolution."
        )
        ai_generated_url = await generate_with_ai_provider(prompt, ai_key)
        if ai_generated_url:
            result_url = ai_generated_url
            source = "ai_generation"

    # Record job status
    _jobs_store[job_id] = {
        "status": "completed",
        "resultUrl": result_url,
        "outfitId": selected_outfit_id,
        "timestamp": timestamp
    }

    return TryOnResponse(
        status="success",
        resultUrl=result_url,
        jobId=job_id,
        source=source,
        timestamp=timestamp
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
