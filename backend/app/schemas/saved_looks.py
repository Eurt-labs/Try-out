from typing import Optional, List
from pydantic import BaseModel

class SavedLookCreate(BaseModel):
    id: Optional[str] = None
    outfitId: str
    outfitName: str
    outfitCategory: Optional[str] = None
    outfitImage: Optional[str] = None
    resultUrl: str
    notes: Optional[str] = None

class SavedLookResponse(BaseModel):
    id: str
    outfitId: str
    outfitName: str
    outfitCategory: Optional[str] = None
    outfitImage: Optional[str] = None
    resultUrl: str
    createdAt: str
    notes: Optional[str] = None

class SavedLooksListResponse(BaseModel):
    looks: List[SavedLookResponse]
    source: str = "backend"
