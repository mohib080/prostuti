import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1.api import api_router
from app.data.seed_data import populate_seed_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed authentic data
    logger.info("Initializing PROSTUTI database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        logger.info("Populating authentic competitive examination questions and syllabuses...")
        populate_seed_data(db)
    finally:
        db.close()
    
    logger.info("PROSTUTI Backend Engine is ready.")
    yield
    # Shutdown logic if any
    logger.info("Shutting down PROSTUTI Backend Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Bangladesh's All-in-One Competitive Job Preparation & Examination Platform (BCS, Bank, Government, Teaching)",
    version=settings.VERSION,
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
