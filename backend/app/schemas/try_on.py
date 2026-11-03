from typing import Optional
from pydantic import BaseModel

class TryOnRequest(BaseModel):
    outfitId: str
    photoAssetId: Optional[str] = None

class TryOnResponse(BaseModel):
    status: str
    resultUrl: Optional[str] = None
    jobId: Optional[str] = None
    error: Optional[str] = None
    source: str = "backend"
    timestamp: Optional[str] = None

class TryOnJobStatus(BaseModel):
    status: str  # 'processing' | 'completed' | 'failed'
    resultUrl: Optional[str] = None
    error: Optional[str] = None

