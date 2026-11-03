from typing import List, Optional
from pydantic import BaseModel

class OutfitSchema(BaseModel):
    id: str
    name: str
    category: str
    gender: str
    image: str
    price: str
    description: str
    fabric: str
    fit: str
    season: str
    tags: List[str]

class CatalogueResponse(BaseModel):
    outfits: List[OutfitSchema]
    categories: List[str]
    source: str = "backend"

