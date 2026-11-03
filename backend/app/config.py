import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

# Load .env file from backend or root directory
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "TRY IT OUT Virtual Fashion API"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = Field(default_factory=lambda: int(os.getenv("PORT", 8000)))
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Supabase Configuration
    SUPABASE_URL: str = Field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    SUPABASE_ANON_KEY: str = Field(default_factory=lambda: os.getenv("SUPABASE_ANON_KEY", ""))
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default_factory=lambda: os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""))
    SUPABASE_JWT_SECRET: str = Field(default_factory=lambda: os.getenv("SUPABASE_JWT_SECRET", ""))

    # Image Generation & AI Keys
    IMAGE_GENERATION_API_KEY: str = Field(default_factory=lambda: os.getenv("IMAGE_GENERATION_API_KEY", ""))
    GEMINI_API_KEY: str = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY", ""))
    GOOGLE_API_KEY: str = Field(default_factory=lambda: os.getenv("GOOGLE_API_KEY", ""))
    OPENAI_API_KEY: str = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY", ""))
    REPLICATE_API_TOKEN: str = Field(default_factory=lambda: os.getenv("REPLICATE_API_TOKEN", ""))
    
    # Storage Directory for Uploads
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

    @property
    def is_supabase_configured(self) -> bool:
        return bool(
            self.SUPABASE_URL 
            and self.SUPABASE_ANON_KEY 
            and "your-project" not in self.SUPABASE_URL
        )

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
