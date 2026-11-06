import json
import csv
import io
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.entities import (
    Question, Subject, Examination, Organization, ExamCategory,
    ReportedQuestion, ExamTemplate, Resource, CurrentAffair, User
)

router = APIRouter()

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """
    Returns platform-wide statistics for the administrative dashboard.
    """
    total_questions = db.query(Question).count()
    authentic_questions = db.query(Question).filter(Question.question_type == "AUTHENTIC_PREVIOUS").count()
    ai_questions = db.query(Question).filter(Question.question_type == "AI_GENERATED").count()
    practice_questions = db.query(Question).filter(Question.question_type == "PRACTICE").count()
    
    total_exams = db.query(Examination).count()
    total_subjects = db.query(Subject).count()
    total_resources = db.query(Resource).count()
    total_current_affairs = db.query(CurrentAffair).count()
    pending_reports = db.query(ReportedQuestion).filter(ReportedQuestion.status == "PENDING").count()

    return {
        "total_questions": total_questions,
        "authentic_questions": authentic_questions,
        "ai_questions": ai_questions,
        "practice_questions": practice_questions,
        "total_exams": total_exams,
        "total_subjects": total_subjects,
        "total_resources": total_resources,
        "total_current_affairs": total_current_affairs,
        "pending_reports": pending_reports
    }

@router.get("/reports")
def list_reported_questions(db: Session = Depends(get_db)):
    """
    Lists reported questions for editorial verification and correction.
    """
    reports = db.query(ReportedQuestion).order_by(desc(ReportedQuestion.id)).all()
    results = []
    for r in reports:
        results.append({
            "id": r.id,
            "question_id": r.question_id,
            "question_text": r.question.question_text_bn or r.question.question_text if r.question else "",
            "reason": r.reason,
            "details": r.details,
            "status": r.status,
            "created_at": r.created_at
        })
    return results

@router.put("/reports/{id}/status")
def update_report_status(id: int, payload: Dict[str, str], db: Session = Depends(get_db)):
    report = db.query(ReportedQuestion).filter(ReportedQuestion.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    new_status = payload.get("status", "RESOLVED").upper()
    report.status = new_status
    db.commit()
    return {"message": f"Report status updated to {new_status}"}

@router.post("/bulk-import")
async def bulk_import_questions(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Bulk import competitive questions from JSON or CSV with duplicate detection.
    """
    content = await file.read()
    filename = file.filename.lower() if file.filename else ""
    
    imported_count = 0
    duplicate_count = 0
    errors = []

    try:
        raw_items = []
        if filename.endswith(".json"):
            raw_items = json.loads(content.decode("utf-8"))
            if not isinstance(raw_items, list):
                raw_items = [raw_items]
        elif filename.endswith(".csv"):
            csv_text = content.decode("utf-8")
            reader = csv.DictReader(io.StringIO(csv_text))
            for row in reader:
                options = [
                    row.get("option_a", ""),
                    row.get("option_b", ""),
                    row.get("option_c", ""),
                    row.get("option_d", "")
                ]
                raw_items.append({
                    "question_text": row.get("question_text", ""),
                    "options": options,
                    "correct_option_index": int(row.get("correct_option_index", 0)),
                    "explanation": row.get("explanation", ""),
                    "subject_id": int(row.get("subject_id", 1)),
                    "difficulty": row.get("difficulty", "MEDIUM"),
                    "source_reference": row.get("source_reference", "Bulk Imported")
                })
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload .json or .csv")

        default_subject = db.query(Subject).first()
        default_subject_id = default_subject.id if default_subject else 1

        for idx, item in enumerate(raw_items):
            q_text = item.get("question_text") or item.get("question_text_bn")
            if not q_text:
                errors.append(f"Row {idx+1}: Missing question text")
                continue

            # Duplicate detection based on identical question text
            existing = db.query(Question).filter(
                (Question.question_text == q_text) | (Question.question_text_bn == q_text)
            ).first()
            if existing:
                duplicate_count += 1
                continue

            options = item.get("options", [])
            if len(options) < 4:
                # Pad to 4 options if needed
                while len(options) < 4:
                    options.append(f"Option {chr(65 + len(options))}")

            new_q = Question(
                question_text=q_text,
                question_text_bn=item.get("question_text_bn", q_text),
                options=options[:4],
                correct_option_index=int(item.get("correct_option_index", 0)),
                explanation=item.get("explanation", ""),
                explanation_bn=item.get("explanation_bn", item.get("explanation", "")),
                subject_id=item.get("subject_id", default_subject_id),
                difficulty=item.get("difficulty", "MEDIUM"),
                language=item.get("language", "BN"),
                question_type=item.get("question_type", "AUTHENTIC_PREVIOUS"),
                source_reference=item.get("source_reference", "Imported Question"),
                is_verified=True,
                is_active=True
            )
            db.add(new_q)
            imported_count += 1

        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

    return {
        "message": "Bulk import completed",
        "imported": imported_count,
        "duplicates_skipped": duplicate_count,
        "errors": errors[:5]
    }
