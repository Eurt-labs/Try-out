import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import health, catalogue, photos, try_on, auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("try-it-out")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI Backend for TRY IT OUT — AI Virtual Fashion Try-On with Supabase Integration"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads static files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(health.router)
app.include_router(catalogue.router)
app.include_router(photos.router)
app.include_router(try_on.router)
app.include_router(auth.router)

@app.on_event("startup")
async def on_startup():
    logger.info("Starting up %s (v%s)...", settings.PROJECT_NAME, settings.VERSION)
    if settings.is_supabase_configured:
        logger.info("Supabase is configured with URL: %s", settings.SUPABASE_URL)
    else:
        logger.info("Running in local demo mode. Add SUPABASE_URL and keys to backend/.env for live cloud sync.")

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down %s...", settings.PROJECT_NAME)

@app.get("/")
async def root():
    return {
        "message": "Welcome to TRY IT OUT Virtual Fashion API",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }
