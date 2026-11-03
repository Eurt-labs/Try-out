from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "supabase_configured": settings.is_supabase_configured
    }

