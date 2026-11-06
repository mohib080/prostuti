from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.core.database import get_db
from app.models.entities import Resource, Subject, Topic
from app.schemas.all_schemas import ResourceOut

router = APIRouter()

@router.get("", response_model=List[ResourceOut])
def list_resources(
    subject_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    resource_type: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lists educational resources (Notes, Summaries, Formulas, Grammar, Constitution).
    """
    query = db.query(Resource)

    if subject_id:
        query = query.filter(Resource.subject_id == subject_id)
    if topic_id:
        query = query.filter(Resource.topic_id == topic_id)
    if resource_type:
        query = query.filter(Resource.resource_type == resource_type)
    if q:
        search_filter = or_(
            Resource.title.ilike(f"%{q}%"),
            Resource.title_bn.ilike(f"%{q}%"),
            Resource.summary.ilike(f"%{q}%"),
            Resource.content_markdown.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    items = query.order_by(desc(Resource.is_featured), desc(Resource.id)).all()

    results = []
    for r in items:
        out = ResourceOut.model_validate(r)
        if r.subject:
            out.subject_name = r.subject.name
            out.subject_name_bn = r.subject.name_bn
        results.append(out)

    return results

@router.get("/{id}", response_model=ResourceOut)
def get_resource(id: int, db: Session = Depends(get_db)):
    r = db.query(Resource).filter(Resource.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    out = ResourceOut.model_validate(r)
    if r.subject:
        out.subject_name = r.subject.name
        out.subject_name_bn = r.subject.name_bn
    return out
