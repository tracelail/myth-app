import json
import os

import httpx
from fastapi import APIRouter, HTTPException

from ..schemas import OracleRequest, OracleResponse

router = APIRouter(prefix="/oracle", tags=["oracle"])

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")

_PROMPT = """\
You are a scholar of mythology, folklore, and cryptids. Generate a grimoire entry for: {subject}

Return ONLY valid JSON with these exact fields:
{{
  "title": "The entity's name",
  "category": "One of: Greek Myth, Norse Myth, Folklore, Cryptid, Other",
  "tags": "comma-separated tags (3-5 short descriptors)",
  "body": "2-3 paragraphs separated by \\n\\n"
}}

No markdown, no extra text — pure JSON only.\
"""


@router.post("/", response_model=OracleResponse)
async def oracle_lookup(payload: OracleRequest) -> OracleResponse:
    prompt = _PROMPT.format(subject=payload.subject)
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            )
            resp.raise_for_status()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Ollama unreachable: {exc}") from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail=f"Ollama error: {exc.response.text}") from exc

    raw: str = resp.json().get("response", "")

    # Strip markdown code fences if the model wraps its JSON
    stripped = raw.strip()
    if stripped.startswith("```"):
        lines = stripped.splitlines()
        raw = "\n".join(lines[1:-1])

    try:
        data: dict[str, str] = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail="Oracle returned non-JSON response") from exc

    return OracleResponse(**data)
