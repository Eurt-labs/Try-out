from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_user, get_optional_user, AuthenticatedUser
from app.schemas.user import UserProfileResponse, UserProfileUpdate
from app.schemas.saved_looks import SavedLookCreate, SavedLookResponse, SavedLooksListResponse
from app.supabase_client import (
    get_user_profile,
    update_user_profile,
    get_user_saved_looks,
    add_user_saved_look,
    remove_user_saved_look
)

router = APIRouter(prefix="/api", tags=["Account & Auth"])

@router.get("/account/profile")
async def get_profile(user: AuthenticatedUser = Depends(get_optional_user)):
    profile = await get_user_profile(user.id, user.email)
    return {
        "user": profile,
        "source": "backend"
    }

@router.put("/account/profile")
async def update_profile(
    updates: UserProfileUpdate,
    user: AuthenticatedUser = Depends(get_optional_user)
):
    update_data = updates.model_dump(exclude_unset=True)
    updated_profile = await update_user_profile(user.id, update_data)
    return {
        "success": True,
        "user": updated_profile,
        "source": "backend"
    }

@router.get("/account/saved-looks", response_model=SavedLooksListResponse)
async def list_saved_looks(user: AuthenticatedUser = Depends(get_optional_user)):
    looks = await get_user_saved_looks(user.id)
    return SavedLooksListResponse(
        looks=looks,
        source="backend"
    )

@router.post("/account/saved-looks")
async def save_look(
    look: SavedLookCreate,
    user: AuthenticatedUser = Depends(get_optional_user)
):
    saved = await add_user_saved_look(user.id, look.model_dump())
    return {
        "success": True,
        "look": saved
    }

@router.delete("/account/saved-looks/{look_id}")
async def delete_saved_look(
    look_id: str,
    user: AuthenticatedUser = Depends(get_optional_user)
):
    success = await remove_user_saved_look(user.id, look_id)
    return {"success": success}

@router.post("/auth/logout")
async def logout(user: AuthenticatedUser = Depends(get_optional_user)):
    return {
        "success": True,
        "message": "User session logged out successfully"
    }
