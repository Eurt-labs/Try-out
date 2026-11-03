import os
import uuid
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.config import settings
from app.auth import get_optional_user, AuthenticatedUser
from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/photos", tags=["Photos"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

@router.post("/upload")
async def upload_photo(
    photo: UploadFile = File(...),
    user: AuthenticatedUser = Depends(get_optional_user)
):
    if not photo.content_type or photo.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Please upload a JPEG, PNG, or WebP image."
        )

    contents = await photo.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of 10MB (Received: {len(contents) / (1024*1024):.1f}MB)."
        )

    file_extension = os.path.splitext(photo.filename or "photo.jpg")[1] or ".jpg"
    asset_id = f"photo_{uuid.uuid4().hex[:12]}"
    filename = f"{asset_id}{file_extension}"

    # Save to local uploads directory
    local_path = os.path.join(settings.UPLOAD_DIR, filename)
    with open(local_path, "wb") as f:
        f.write(contents)

    local_url = f"/uploads/{filename}"

    # If Supabase storage is available, upload to Supabase storage bucket
    supabase_client = get_supabase_client()
    photo_url = local_url
    if supabase_client:
        try:
            # Upload to 'user_photos' bucket
            storage_path = f"{user.id}/{filename}"
            supabase_client.storage.from_("user_photos").upload(
                storage_path,
                contents,
                file_options={"content-type": photo.content_type}
            )
            # Retrieve public URL
            public_res = supabase_client.storage.from_("user_photos").get_public_url(storage_path)
            if public_res:
                photo_url = public_res

            # Record in user_photos table
            supabase_client.table("user_photos").insert({
                "user_id": user.id,
                "photo_url": photo_url,
                "asset_id": asset_id
            }).execute()
        except Exception as e:
            # Fallback to local url
            pass

    return {
        "assetId": asset_id,
        "url": photo_url,
        "backendUploaded": True,
        "filename": filename,
        "sizeBytes": len(contents)
    }

@router.get("/{asset_id}")
async def get_photo_info(asset_id: str):
    # Check if exists in upload directory
    matches = [f for f in os.listdir(settings.UPLOAD_DIR) if f.startswith(asset_id)]
    if not matches:
        raise HTTPException(status_code=404, detail="Photo not found")
    filename = matches[0]
    return {
        "assetId": asset_id,
        "url": f"/uploads/{filename}",
        "filename": filename
    }
