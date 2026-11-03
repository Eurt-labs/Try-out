import asyncio
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Request, HTTPException, Form, UploadFile, File
from app.data.outfits import OUTFITS
from app.schemas.try_on import TryOnResponse, TryOnJobStatus

router = APIRouter(prefix="/api/try-on", tags=["Virtual Try-On"])

# In-memory storage for virtual try-on asynchronous jobs
_jobs_store: Dict[str, Dict[str, Any]] = {}

@router.post("", response_model=TryOnResponse)
async def generate_try_on(
    request: Request,
    outfitId: Optional[str] = Form(None),
    photoAssetId: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    # Support both FormData and JSON body
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

    # The result image uses the high-definition garment render
    result_url = outfit["image"]

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
        source="backend",
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
