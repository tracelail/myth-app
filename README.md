# Myth App — Personal Grimoire

A dark-themed mobile + web app for cataloguing mythology, folklore, and cryptids. Built as a passion project and as a hands-on learning experience with [Claude Code](https://claude.ai/code).

![Stack](https://img.shields.io/badge/stack-FastAPI%20%2B%20Expo-c9853a?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## What it is

A personal grimoire — a place to write and browse entries on mythological figures, folklore creatures, and cryptids. Each entry has a title, category, tags, and body. An **Oracle** screen lets you summon an AI-generated entry for any subject using a local Ollama model.

**Categories:** Greek Myth · Norse Myth · Folklore · Cryptid · Other

---

## Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy, SQLite |
| Frontend | React Native, Expo Router, TypeScript |
| AI / Oracle | Ollama (llama3.1, runs locally) |
| Dev tooling | [pixi](https://pixi.sh) · [just](https://just.systems) · ruff · mypy · pytest |

---

## Setup

**Prerequisites:** [pixi](https://pixi.sh/latest/#installation), [Node.js](https://nodejs.org), [just](https://just.systems/man/en/packages.html)

```bash
# 1. Install all backend dependencies
just setup

# 2. Install frontend dependencies
cd client && npm install && cd ..
```

---

## Running

```bash
just dev
# Press w → web browser
# Press a → Android emulator
# Scan QR code → Expo Go on your phone
```

This starts the backend API (port 8000) and the Expo dev client together. Ctrl-C stops both.

**Phone setup:** copy `client/.env.example` to `client/.env.local` and set `EXPO_PUBLIC_API_URL` to your machine's local IP:

```
EXPO_PUBLIC_API_URL=http://192.168.x.x:8000
```

**Oracle setup:** install [Ollama](https://ollama.com) and pull the model:

```bash
ollama pull llama3.1
```

---

## Project structure

```
myth-app/
├── server/          # FastAPI backend
│   └── src/myth_app/
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       └── routes/
│           ├── entries.py   # CRUD for grimoire entries
│           └── oracle.py    # AI entry generation via Ollama
├── client/          # Expo Router frontend
│   ├── app/
│   │   ├── index.tsx        # Entry list + search + filter
│   │   ├── add.tsx          # New entry form
│   │   ├── oracle.tsx       # AI oracle screen
│   │   └── entry/[id].tsx   # Entry detail + delete
│   ├── components/
│   └── constants/theme.ts   # Dark palette + category colours
└── justfile         # Task runner shortcuts
```

---

## Other commands

```bash
just test       # run test suite
just lint       # ruff lint
just typecheck  # mypy
just check      # lint + typecheck + test
just format     # auto-format
```

---

## About

Made by [Lail J](https://github.com/lailj) as a passion project — mythology and folklore have always been a core interest — and as a learning exercise with **Claude Code**, Anthropic's CLI coding assistant.

---

## License

MIT — see [LICENSE](LICENSE).
