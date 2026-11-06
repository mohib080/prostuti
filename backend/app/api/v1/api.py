from fastapi import APIRouter
from app.api.v1.endpoints import (
    questions, exams, resources, probable, current_affairs, ai_assistant, collections, admin
)

api_router = APIRouter()

api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(exams.router, prefix="/exams", tags=["exams"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(probable.router, prefix="/probable", tags=["probable-questions"])
api_router.include_router(current_affairs.router, prefix="/current-affairs", tags=["current-affairs"])
api_router.include_router(ai_assistant.router, prefix="/ai", tags=["ai-assistant"])
api_router.include_router(collections.router, prefix="/collections", tags=["collections"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
