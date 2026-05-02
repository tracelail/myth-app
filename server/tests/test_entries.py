from fastapi.testclient import TestClient

from myth_app.main import app

client = TestClient(app)


def test_list_entries_returns_seeds() -> None:
    r = client.get("/entries/")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(e["title"] == "Sisyphus" for e in data)


def test_create_entry() -> None:
    payload = {
        "title": "Medusa",
        "category": "Greek Myth",
        "tags": "gorgon,monster,perseus",
        "body": "A gorgon whose gaze turned men to stone.",
    }
    r = client.post("/entries/", json=payload)
    assert r.status_code == 201
    body = r.json()
    assert body["title"] == "Medusa"
    assert "id" in body


def test_delete_entry() -> None:
    created = client.post(
        "/entries/",
        json={"title": "Temp", "category": "Other", "tags": "", "body": "Temporary."},
    )
    entry_id = created.json()["id"]
    assert client.delete(f"/entries/{entry_id}").status_code == 204
    entries = client.get("/entries/").json()
    assert not any(e["id"] == entry_id for e in entries)


def test_delete_missing_returns_404() -> None:
    r = client.delete("/entries/999999")
    assert r.status_code == 404
