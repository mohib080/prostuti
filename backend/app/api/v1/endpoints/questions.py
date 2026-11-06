from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.core.database import get_db
from app.models.entities import (
    Question, Subject, Topic, Examination, Organization, ExamCategory, ReportedQuestion
)
from app.schemas.all_schemas import (
    QuestionOut, QuestionListResponse, QuestionCreate, ReportQuestionCreate
)

router = APIRouter()

@router.get("/meta/filters")
def get_filter_metadata(db: Session = Depends(get_db)):
    """
    Returns available filter criteria (categories, organizations, exams, subjects, years).
    """
    categories = db.query(ExamCategory).order_by(ExamCategory.display_order).all()
    orgs = db.query(Organization).all()
    exams = db.query(Examination).order_by(desc(Examination.year)).all()
    subjects = db.query(Subject).all()
    
    # Distinct years
    years = db.query(Question.year).filter(Question.year.isnot(None)).distinct().order_by(desc(Question.year)).all()
    year_list = [y[0] for y in years if y[0]]

    return {
        "categories": [{"id": c.id, "name": c.name, "name_bn": c.name_bn, "slug": c.slug} for c in categories],
        "organizations": [{"id": o.id, "name": o.name, "name_bn": o.name_bn, "code": o.code} for o in orgs],
        "examinations": [{"id": e.id, "name": e.name, "name_bn": e.name_bn, "year": e.year} for e in exams],
        "subjects": [{"id": s.id, "name": s.name, "name_bn": s.name_bn, "code": s.code, "icon": s.icon} for s in subjects],
        "years": year_list
    }

@router.get("", response_model=QuestionListResponse)
def list_questions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    organization_id: Optional[int] = None,
    examination_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    year: Optional[int] = None,
    difficulty: Optional[str] = None,
    language: Optional[str] = None,
    question_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Full-text search and multi-facet filtering for the Question Bank.
    """
    query = db.query(Question).filter(Question.is_active == True)

    if q:
        search_filter = or_(
            Question.question_text.ilike(f"%{q}%"),
            Question.question_text_bn.ilike(f"%{q}%"),
            Question.explanation.ilike(f"%{q}%"),
            Question.source_reference.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    if category_id:
        query = query.filter(Question.category_id == category_id)
    if organization_id:
        query = query.filter(Question.organization_id == organization_id)
    if examination_id:
        query = query.filter(Question.examination_id == examination_id)
    if subject_id:
        query = query.filter(Question.subject_id == subject_id)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    if year:
        query = query.filter(Question.year == year)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty.upper())
    if language:
        query = query.filter(Question.language == language.upper())
    if question_type:
        query = query.filter(Question.question_type == question_type)

    total = query.count()
    items = query.order_by(desc(Question.id)).offset((page - 1) * page_size).limit(page_size).all()

    # Hydrate metadata names
    results = []
    for item in items:
        out = QuestionOut.model_validate(item)
        if item.subject:
            out.subject_name = item.subject.name
            out.subject_name_bn = item.subject.name_bn
        if item.topic:
            out.topic_name = item.topic.name_bn or item.topic.name
        if item.examination:
            out.exam_name = item.examination.name_bn or item.examination.name
        if item.organization:
            out.org_name = item.organization.name_bn or item.organization.name
        if item.category:
            out.category_name = item.category.name_bn or item.category.name
        results.append(out)

    return QuestionListResponse(
        total=total,
        page=page,
        page_size=page_size,
        questions=results
    )

@router.get("/{id}", response_model=QuestionOut)
def get_question_detail(id: int, db: Session = Depends(get_db)):
    item = db.query(Question).filter(Question.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    
    out = QuestionOut.model_validate(item)
    if item.subject:
        out.subject_name = item.subject.name
        out.subject_name_bn = item.subject.name_bn
    if item.topic:
        out.topic_name = item.topic.name_bn or item.topic.name
    if item.examination:
        out.exam_name = item.examination.name_bn or item.examination.name
    if item.organization:
        out.org_name = item.organization.name_bn or item.organization.name
    if item.category:
        out.category_name = item.category.name_bn or item.category.name
    return out

@router.post("", response_model=QuestionOut)
def create_question(payload: QuestionCreate, db: Session = Depends(get_db)):
    q = Question(**payload.model_dump())
    db.add(q)
    db.commit()
    db.refresh(q)
    return QuestionOut.model_validate(q)

@router.post("/{id}/report")
def report_question(id: int, payload: ReportQuestionCreate, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    report = ReportedQuestion(
        question_id=id,
        reason=payload.reason,
        details=payload.details
    )
    q.report_count += 1
    db.add(report)
    db.commit()
    return {"message": "Question reported successfully. Our editorial team will review it."}
