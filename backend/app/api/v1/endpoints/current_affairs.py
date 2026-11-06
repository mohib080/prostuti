from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.core.database import get_db
from app.models.entities import CurrentAffair
from app.schemas.all_schemas import CurrentAffairOut
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("", response_model=List[CurrentAffairOut])
def list_current_affairs(
    category: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lists current affairs articles with date and category filters.
    """
    query = db.query(CurrentAffair).filter(CurrentAffair.is_published == True)

    if category and category.upper() != "ALL":
        query = query.filter(CurrentAffair.category == category.upper())
    if q:
        search_filter = or_(
            CurrentAffair.title.ilike(f"%{q}%"),
            CurrentAffair.title_bn.ilike(f"%{q}%"),
            CurrentAffair.summary.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    items = query.order_by(desc(CurrentAffair.publish_date)).all()
    return [CurrentAffairOut.model_validate(item) for item in items]

@router.get("/{id}", response_model=CurrentAffairOut)
def get_current_affair(id: int, db: Session = Depends(get_db)):
    ca = db.query(CurrentAffair).filter(CurrentAffair.id == id).first()
    if not ca:
        raise HTTPException(status_code=404, detail="Current affair article not found")
    return CurrentAffairOut.model_validate(ca)

@router.post("/{id}/generate-mcqs")
async def generate_mcqs_for_current_affair(id: int, db: Session = Depends(get_db)):
    """
    Generates examination-standard MCQs directly from a current affairs article.
    """
    ca = db.query(CurrentAffair).filter(CurrentAffair.id == id).first()
    if not ca:
        raise HTTPException(status_code=404, detail="Current affair article not found")

    generated_mcqs = await ai_service.generate_current_affairs_mcqs(
        title=ca.title_bn or ca.title,
        summary=ca.summary,
        important_facts=ca.important_facts or []
    )

    ca.mcqs = generated_mcqs
    db.commit()

    return {"message": "MCQs generated successfully", "mcqs": generated_mcqs}
