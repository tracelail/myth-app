from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Entry
from ..schemas import EntryCreate, EntryResponse

router = APIRouter(prefix="/entries", tags=["entries"])


@router.get("/", response_model=list[EntryResponse])
def list_entries(db: Session = Depends(get_db)) -> list[EntryResponse]:
    rows = db.query(Entry).order_by(Entry.created_at.desc()).all()
    return [EntryResponse.model_validate(row) for row in rows]


@router.post("/", response_model=EntryResponse, status_code=201)
def create_entry(payload: EntryCreate, db: Session = Depends(get_db)) -> EntryResponse:
    entry = Entry(**payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return EntryResponse.model_validate(entry)


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: int, db: Session = Depends(get_db)) -> None:
    entry = db.get(Entry, entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
