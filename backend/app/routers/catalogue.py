from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from app.data.outfits import OUTFITS, CATEGORIES
from app.schemas.catalogue import CatalogueResponse, OutfitSchema

router = APIRouter(prefix="/api/catalogue", tags=["Catalogue"])

@router.get("", response_model=CatalogueResponse)
async def get_catalogue(
    category: str = Query("All", description="Category filter"),
    search: str = Query("", description="Search term for names, fabrics, tags")
):
    filtered = list(OUTFITS)

    if category and category.lower() != "all":
        filtered = [item for item in filtered if item["category"].lower() == category.lower()]

    if search and search.strip():
        q = search.lower().strip()
        filtered = [
            item for item in filtered
            if (
                q in item["name"].lower()
                or q in item["category"].lower()
                or q in item.get("description", "").lower()
                or any(q in t.lower() for t in item.get("tags", []))
            )
        ]

    return CatalogueResponse(
        outfits=filtered,
        categories=CATEGORIES,
        source="backend"
    )

@router.get("/categories", response_model=List[str])
async def get_categories():
    return CATEGORIES

@router.get("/{outfit_id}", response_model=OutfitSchema)
async def get_outfit_by_id(outfit_id: str):
    found = next((item for item in OUTFITS if item["id"] == outfit_id), None)
    if not found:
        raise HTTPException(status_code=404, detail=f"Outfit with ID '{outfit_id}' not found.")
    return found

