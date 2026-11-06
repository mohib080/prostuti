from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.entities import Collection, CollectionItem, Bookmark, Question, Resource
from app.schemas.all_schemas import (
    CollectionCreate, CollectionOut, BookmarkCreate, BookmarkOut, QuestionOut, ResourceOut
)

router = APIRouter()

# --- COLLECTIONS ---
@router.get("", response_model=List[CollectionOut])
def list_collections(db: Session = Depends(get_db)):
    collections = db.query(Collection).order_by(desc(Collection.id)).all()
    results = []
    for c in collections:
        out = CollectionOut(
            id=c.id,
            name=c.name,
            description=c.description,
            is_public=c.is_public,
            question_count=len(c.items),
            created_at=c.created_at
        )
        results.append(out)
    return results

@router.post("", response_model=CollectionOut)
def create_collection(payload: CollectionCreate, db: Session = Depends(get_db)):
    col = Collection(
        name=payload.name,
        description=payload.description,
        is_public=payload.is_public
    )
    db.add(col)
    db.commit()
    db.refresh(col)
    return CollectionOut(
        id=col.id,
        name=col.name,
        description=col.description,
        is_public=col.is_public,
        question_count=0,
        created_at=col.created_at
    )

@router.get("/{id}/questions", response_model=List[QuestionOut])
def get_collection_questions(id: int, db: Session = Depends(get_db)):
    col = db.query(Collection).filter(Collection.id == id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    questions = [item.question for item in col.items if item.question]
    results = []
    for q in questions:
        out = QuestionOut.model_validate(q)
        if q.subject:
            out.subject_name = q.subject.name
            out.subject_name_bn = q.subject.name_bn
        if q.topic:
            out.topic_name = q.topic.name_bn
        if q.examination:
            out.exam_name = q.examination.name_bn
        results.append(out)
    return results

@router.post("/{id}/items")
def add_question_to_collection(id: int, question_id: int, db: Session = Depends(get_db)):
    col = db.query(Collection).filter(Collection.id == id).first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    existing = db.query(CollectionItem).filter(
        CollectionItem.collection_id == id,
        CollectionItem.question_id == question_id
    ).first()
    if existing:
        return {"message": "Question already exists in this collection"}

    item = CollectionItem(collection_id=id, question_id=question_id)
    db.add(item)
    db.commit()
    return {"message": "Question added to collection successfully"}

@router.delete("/{id}/items/{question_id}")
def remove_question_from_collection(id: int, question_id: int, db: Session = Depends(get_db)):
    item = db.query(CollectionItem).filter(
        CollectionItem.collection_id == id,
        CollectionItem.question_id == question_id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Question removed from collection"}

# --- BOOKMARKS ---
@router.get("/bookmarks/all")
def get_all_bookmarks(db: Session = Depends(get_db)):
    bookmarks = db.query(Bookmark).order_by(desc(Bookmark.id)).all()
    
    # Expand bookmark references
    items = []
    for b in bookmarks:
        entry = {
            "id": b.id,
            "item_type": b.item_type,
            "item_id": b.item_id,
            "notes": b.notes,
            "created_at": b.created_at,
            "item_data": None
        }
        if b.item_type == "QUESTION":
            q = db.query(Question).filter(Question.id == b.item_id).first()
            if q:
                entry["item_data"] = {
                    "title": q.question_text_bn or q.question_text,
                    "subject": q.subject.name_bn if q.subject else "",
                    "exam": q.examination.name_bn if q.examination else ""
                }
        elif b.item_type == "RESOURCE":
            r = db.query(Resource).filter(Resource.id == b.item_id).first()
            if r:
                entry["item_data"] = {
                    "title": r.title_bn or r.title,
                    "type": r.resource_type,
                    "subject": r.subject.name_bn if r.subject else ""
                }
        items.append(entry)
    return items

@router.post("/bookmarks")
def create_bookmark(payload: BookmarkCreate, db: Session = Depends(get_db)):
    existing = db.query(Bookmark).filter(
        Bookmark.item_type == payload.item_type,
        Bookmark.item_id == payload.item_id
    ).first()
    if existing:
        return {"message": "Already bookmarked", "id": existing.id}

    bm = Bookmark(
        item_type=payload.item_type,
        item_id=payload.item_id,
        notes=payload.notes
    )
    db.add(bm)
    db.commit()
    db.refresh(bm)
    return {"message": "Bookmarked successfully", "id": bm.id}

@router.delete("/bookmarks/{id}")
def delete_bookmark(id: int, db: Session = Depends(get_db)):
    bm = db.query(Bookmark).filter(Bookmark.id == id).first()
    if bm:
        db.delete(bm)
        db.commit()
    return {"message": "Bookmark removed"}
