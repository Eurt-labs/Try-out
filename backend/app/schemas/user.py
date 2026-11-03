from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class UserPreferences(BaseModel):
    preferredCategory: str = "All"
    genderPreference: str = "All Styles"
    notifications: bool = True
    highQualityRender: bool = True

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    avatarUrl: Optional[str] = None
    tier: Optional[str] = "Standard Member"
    memberSince: Optional[str] = "2026"
    preferences: Optional[UserPreferences] = None
    stats: Optional[Dict[str, int]] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatarUrl: Optional[str] = None
    preferences: Optional[UserPreferences] = None
