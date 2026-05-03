# V2 Roadmap

Ideas and directions for the next version of Myth App.

---

## Distribution — making it shareable

The current setup requires cloning the repo and installing pixi, Node.js, and just.
The goal for V2 is a single-step launch for non-technical friends.

### Option A: Zip bundle (preferred for local-only)
- Export the Expo frontend as a static web build (`npx expo export`)
- Bundle the Python backend into a single executable with **PyInstaller** (no Python install needed)
- Have the backend serve the static frontend files
- Ship as a platform zip (Mac / Windows / Linux) with a double-click launcher script
- Con: separate zip per platform, bundles can be 50–100 MB

### Option B: Docker
- Single `docker compose up` starts everything
- Requires Docker Desktop (~500 MB install) — still friction for non-devs
- Better fit for developers or self-hosters

### Lite mode (no Oracle)
- Add a flag (`DISABLE_ORACLE=true` in `.env`) that hides the Oracle button and disables the route
- Ships as the default — no Ollama or 4 GB model download required
- Oracle becomes an optional power-user add-on documented separately

---

## Features

- [ ] Edit existing entries (currently add + delete only)
- [ ] Entry detail images / illustration support
- [ ] Export grimoire to PDF or markdown
- [ ] Tags as clickable filters (not just search)
- [ ] Oracle history — save generated entries with one tap
- [ ] Dark/light theme toggle

---

## Tech

- [ ] Migrate SQLite → PostgreSQL for multi-user or hosted deployments
- [ ] Swap Ollama for a hosted model option (Claude API) as an alternative Oracle backend
- [ ] EAS Build for native iOS/Android release builds

---

## Notes

- Keep it local-first — no accounts, no cloud sync required
- Oracle should always be optional (no hard dependency on Ollama)
