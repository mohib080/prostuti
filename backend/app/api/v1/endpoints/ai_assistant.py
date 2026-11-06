from fastapi import APIRouter
from app.schemas.all_schemas import AIChatRequest, AIChatResponse
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_prostuti_ai(req: AIChatRequest):
    """
    Conversational study mentor for BCS, Bank & competitive exams in Bangladesh.
    Explains concepts, solves math, deconstructs grammatical nuances, and formulates written answers.
    """
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    result = await ai_service.chat_assistant(
        messages=messages,
        context_type=req.context_type or "GENERAL",
        context_data=req.context_data
    )
    return AIChatResponse(**result)
