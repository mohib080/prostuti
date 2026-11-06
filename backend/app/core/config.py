import os
from typing import List

class Settings:
    PROJECT_NAME: str = "PROSTUTI (প্রস্তুতি)"
    PROJECT_TAGLINE: str = "Prepare. Practice. Prevail."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database: Default to SQLite for seamless zero-config local run, supports PostgreSQL via env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./prostuti.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "prostuti_secret_key_bangladesh_bcs_exam_2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI - Gemini API
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
