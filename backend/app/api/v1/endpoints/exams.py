import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

from app.core.database import get_db
from app.models.entities import (
    ExamTemplate, ExamAttempt, Question, Subject, Topic, Examination
)
from app.schemas.all_schemas import (
    ExamTemplateOut, ExamStartRequest, ExamSessionOut, ExamQuestionOut,
    ExamSubmissionRequest, ExamResultOut, ExamQuestionReviewItem
)

router = APIRouter()

# In-memory session question map for active test takers
ACTIVE_EXAM_SESSIONS = {}

@router.get("/templates", response_model=List[ExamTemplateOut])
def get_exam_templates(db: Session = Depends(get_db)):
    """
    Returns active mock exam templates (Full Mock, Bank AD, Quick Challenge, etc.)
    """
    templates = db.query(ExamTemplate).filter(ExamTemplate.is_active == True).all()
    return [ExamTemplateOut.model_validate(t) for t in templates]

@router.post("/start", response_model=ExamSessionOut)
def start_examination(req: ExamStartRequest, db: Session = Depends(get_db)):
    """
    Initializes a realistic examination session based on selected mode and parameters.
    """
    query = db.query(Question).filter(Question.is_active == True)

    title = req.title or "প্রস্তুতি প্রতিযোগিতামূলক মক পরীক্ষা"
    duration = req.duration_minutes
    total_q = req.total_questions
    negative_rate = req.negative_mark_rate

    # If template selected, load template presets
    if req.template_id:
        tmpl = db.query(ExamTemplate).filter(ExamTemplate.id == req.template_id).first()
        if tmpl:
            title = tmpl.title_bn or tmpl.title
            duration = tmpl.duration_minutes
            total_q = tmpl.total_questions
            negative_rate = tmpl.negative_mark_rate

    if req.subject_ids:
        query = query.filter(Question.subject_id.in_(req.subject_ids))
    if req.topic_ids:
        query = query.filter(Question.topic_id.in_(req.topic_ids))
    if req.examination_id:
        query = query.filter(Question.examination_id == req.examination_id)
    if req.category_id:
        query = query.filter(Question.category_id == req.category_id)
    if req.difficulty:
        query = query.filter(Question.difficulty == req.difficulty.upper())
    
    if req.question_source == "AUTHENTIC_ONLY":
        query = query.filter(Question.question_type == "AUTHENTIC_PREVIOUS")
    elif req.question_source == "GENERATED_ONLY":
        query = query.filter(Question.question_type == "AI_GENERATED")

    # Fetch questions randomized
    db_questions = query.order_by(func.random()).limit(total_q).all()

    # Fallback to general pool if specific filter had fewer questions
    if len(db_questions) < total_q:
        extra_count = total_q - len(db_questions)
        existing_ids = [q.id for q in db_questions]
        extras = db.query(Question).filter(
            Question.is_active == True,
            Question.id.notin_(existing_ids)
        ).order_by(func.random()).limit(extra_count).all()
        db_questions.extend(extras)

    if not db_questions:
        raise HTTPException(status_code=400, detail="No questions available matching these parameters.")

    session_id = str(uuid.uuid4())
    # Save session question metadata in memory for secure evaluation upon submission
    ACTIVE_EXAM_SESSIONS[session_id] = {
        "question_ids": [q.id for q in db_questions],
        "negative_mark_rate": negative_rate,
        "title": title,
        "started_at": datetime.datetime.utcnow()
    }

    exam_questions = []
    for q in db_questions:
        exam_questions.append(ExamQuestionOut(
            id=q.id,
            question_text=q.question_text_bn or q.question_text,
            options=q.options,
            subject_name=q.subject.name if q.subject else "General",
            subject_name_bn=q.subject.name_bn if q.subject else "সাধারণ বিষয়াবলী",
            topic_name=q.topic.name_bn if q.topic else None,
            exam_name=q.examination.name_bn if q.examination else None,
            year=q.year,
            difficulty=q.difficulty,
            language=q.language
        ))

    return ExamSessionOut(
        session_id=session_id,
        title=title,
        duration_minutes=duration,
        total_questions=len(exam_questions),
        total_marks=float(len(exam_questions)),
        negative_mark_rate=negative_rate,
        questions=exam_questions
    )

@router.post("/submit", response_model=ExamResultOut)
def submit_examination(req: ExamSubmissionRequest, db: Session = Depends(get_db)):
    """
    Evaluates candidate answers, applies negative marking, stores attempt,
    and returns full review breakdown with answers and explanations.
    """
    session_data = ACTIVE_EXAM_SESSIONS.get(req.session_id)
    negative_rate = req.negative_mark_rate
    
    # Map submission answers
    user_choices = {item.question_id: item.selected_option_index for item in req.answers}

    # Retrieve all question entities from DB
    question_ids = list(user_choices.keys())
    if session_data:
        question_ids = session_data["question_ids"]

    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    q_map = {q.id: q for q in questions}

    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0
    reviews = []

    for q_id in question_ids:
        q = q_map.get(q_id)
        if not q:
            continue

        selected = user_choices.get(q_id)
        is_unanswered = (selected is None)
        is_correct = (selected == q.correct_option_index) if not is_unanswered else False

        if is_unanswered:
            unanswered_count += 1
        elif is_correct:
            correct_count += 1
        else:
            incorrect_count += 1

        reviews.append(ExamQuestionReviewItem(
            question_id=q.id,
            question_text=q.question_text_bn or q.question_text,
            options=q.options,
            selected_option_index=selected,
            correct_option_index=q.correct_option_index,
            is_correct=is_correct,
            is_unanswered=is_unanswered,
            explanation=q.explanation,
            explanation_bn=q.explanation_bn,
            source_reference=q.source_reference,
            subject_name=q.subject.name if q.subject else "General",
            topic_name=q.topic.name_bn if q.topic else None
        ))

    total_q = len(question_ids)
    total_marks = float(total_q)
    negative_deducted = incorrect_count * negative_rate
    obtained = max(0.0, float(correct_count) - negative_deducted)
    percentage = (obtained / total_marks * 100.0) if total_marks > 0 else 0.0
    passed = percentage >= 50.0

    # Save attempt in database
    attempt = ExamAttempt(
        title=req.title,
        started_at=session_data.get("started_at", datetime.datetime.utcnow()) if session_data else datetime.datetime.utcnow(),
        completed_at=datetime.datetime.utcnow(),
        duration_seconds=req.time_taken_seconds,
        total_questions=total_q,
        total_marks=total_marks,
        obtained_marks=obtained,
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        unanswered_count=unanswered_count,
        negative_marks_deducted=negative_deducted,
        percentage=round(percentage, 2),
        passed=passed,
        answers_data=[item.model_dump() for item in req.answers]
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    # Clean up session
    if req.session_id in ACTIVE_EXAM_SESSIONS:
        del ACTIVE_EXAM_SESSIONS[req.session_id]

    return ExamResultOut(
        attempt_id=attempt.id,
        title=req.title,
        total_questions=total_q,
        total_marks=total_marks,
        obtained_marks=round(obtained, 2),
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        unanswered_count=unanswered_count,
        negative_marks_deducted=round(negative_deducted, 2),
        percentage=round(percentage, 2),
        passed=passed,
        time_taken_seconds=req.time_taken_seconds,
        reviews=reviews
    )

@router.get("/attempts/{attempt_id}")
def get_exam_attempt_detail(attempt_id: int, db: Session = Depends(get_db)):
    attempt = db.query(ExamAttempt).filter(ExamAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Exam attempt not found")
    return attempt
