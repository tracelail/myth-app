from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, engine
from .models import Entry
from .routes import entries, oracle

_SEEDS = [
    {
        "title": "Sisyphus",
        "category": "Greek Myth",
        "tags": "punishment,underworld,trickster",
        "body": (
            "Condemned to roll a boulder up a hill for eternity — only for it to tumble"
            " back down every time he nears the top.\n\nCrime: Cheating death. Twice. He"
            " tricked Persephone into letting him return to the living world, and had"
            " earlier bound Thanatos (god of death) in chains, temporarily making all"
            " mortals immortal."
        ),
    },
    {
        "title": "Ixion",
        "category": "Greek Myth",
        "tags": "punishment,underworld,hubris",
        "body": (
            "Bound to a spinning wheel of fire that flies through the sky forever.\n\n"
            "Crime: Attempting to seduce Hera, queen of the gods — after Zeus had shown"
            " him great hospitality. Zeus tricked him first by sending a cloud shaped"
            " like Hera. Ixion took the bait, and that was that."
        ),
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    Base.metadata.create_all(bind=engine)
    _seed_if_empty()
    yield


def _seed_if_empty() -> None:
    db = SessionLocal()
    try:
        if db.query(Entry).count() == 0:
            for data in _SEEDS:
                db.add(Entry(**data))
            db.commit()
    finally:
        db.close()


app = FastAPI(title="Myth App — Grimoire API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entries.router)
app.include_router(oracle.router)
