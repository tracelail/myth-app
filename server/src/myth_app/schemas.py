from datetime import datetime

from pydantic import BaseModel


class EntryCreate(BaseModel):
    title: str
    category: str
    tags: str = ""
    body: str


class EntryResponse(BaseModel):
    id: int
    title: str
    category: str
    tags: str
    body: str
    created_at: datetime

    model_config = {"from_attributes": True}


class OracleRequest(BaseModel):
    subject: str


class OracleResponse(BaseModel):
    title: str
    category: str
    tags: str
    body: str
