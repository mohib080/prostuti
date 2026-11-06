from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.entities import Subject, Topic, Question, AIGenerationLog
from app.schemas.all_schemas import ProbableGenerateRequest, ProbableQuestionItem
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/generate", response_model=List[ProbableQuestionItem])
async def generate_probable_questions(
    req: ProbableGenerateRequest,
    db: Session = Depends(get_db)
):
    """
    Generates probable practice MCQs based on past question frequency,
    official syllabus patterns, and recent developments.
    Strictly labeled as AI-generated practice material.
    """
    subject = db.query(Subject).filter(Subject.id == req.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    topic_name = req.topic_name
    if req.topic_id:
        topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
        if topic:
            topic_name = topic.name_bn or topic.name

    generated_data = await ai_service.generate_probable_questions(
        target_exam=req.target_exam,
        subject_name=subject.name_bn or subject.name,
        topic_name=topic_name,
        difficulty=req.difficulty,
        language=req.language,
        question_count=req.question_count,
        additional_instructions=req.additional_instructions
    )

    # Log AI generation record
    log = AIGenerationLog(
        target_exam=req.target_exam,
        subject_id=req.subject_id,
        topic_id=req.topic_id,
        difficulty=req.difficulty,
        language=req.language,
        question_count=len(generated_data),
        generated_questions=generated_data
    )
    db.add(log)
    db.commit()

    results = []
    for item in generated_data:
        results.append(ProbableQuestionItem(
            question_text=item.get("question_text", ""),
            options=item.get("options", []),
            correct_option_index=item.get("correct_option_index", 0),
            explanation=item.get("explanation", ""),
            subject_name=subject.name_bn or subject.name,
            topic_name=topic_name or "সাধারণ ধারণা",
            difficulty=item.get("difficulty", req.difficulty),
            curriculum_relevance=item.get("curriculum_relevance", "বিসিএস প্রিলিমিনারি ও ব্যাংক পরীক্ষার সিলেবাস ভিত্তিক ধারণা।"),
            frequently_repeated_concept=True,
            is_ai_generated=True
        ))

    return results

@router.post("/save-to-bank")
def save_probable_question_to_bank(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Saves a verified AI-generated question into the Question Bank with explicit AI_GENERATED type.
    """
    subject_id = payload.get("subject_id", 1)
    q = Question(
        question_text=payload.get("question_text", ""),
        question_text_bn=payload.get("question_text", ""),
        options=payload.get("options", []),
        correct_option_index=payload.get("correct_option_index", 0),
        explanation=payload.get("explanation", ""),
        explanation_bn=payload.get("explanation", ""),
        subject_id=subject_id,
        difficulty=payload.get("difficulty", "MEDIUM"),
        language=payload.get("language", "BN"),
        question_type="AI_GENERATED",
        source_reference="প্রস্তুতি এআই সম্ভাব্য অনুশীলন প্রশ্নব্যাংক",
        is_verified=True,
        is_active=True
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"message": "Question saved to Question Bank successfully", "question_id": q.id}
