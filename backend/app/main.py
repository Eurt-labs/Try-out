import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Include API Routers under /api
app.include_router(health.router)
app.include_router(catalogue.router)
app.include_router(photos.router)
app.include_router(try_on.router)
app.include_router(auth.router)

# Locate frontend dist directory
possible_dist_dirs = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "dist"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist"),
    os.path.join(os.getcwd(), "dist")
]
dist_dir = next((d for d in possible_dist_dirs if os.path.exists(d)), None)

if dist_dir:
    logger.info("Mounting frontend dist directory from: %s", dist_dir)
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")
else:
    @app.get("/")
    async def root():
        return {
            "message": "Welcome to TRY IT OUT Virtual Fashion API",
            "docs_url": "/docs",
            "health_check": "/api/health"
        }

@app.on_event("startup")
async def on_startup():
    logger.info("Starting up %s (v%s) on port %d...", settings.PROJECT_NAME, settings.VERSION, settings.PORT)
    if settings.is_supabase_configured:
        logger.info("Supabase is configured with URL: %s", settings.SUPABASE_URL)
    else:
        logger.info("Running in demo mode. Configure SUPABASE_URL in environment for live database sync.")

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down %s...", settings.PROJECT_NAME)
