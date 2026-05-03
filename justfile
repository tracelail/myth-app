# justfile — task runner for myth-app
# Run `just` with no arguments to list all available recipes.
# Run `just <recipe>` to execute a recipe.
#
# First time setup:
#   just setup
#
# Daily workflow:
#   just dev        ← start backend + Expo together
#   just check      ← run before every commit
#   just test       ← run after adding new code
#   just format     ← fix formatting automatically

set quiet

# List all available recipes
default:
    @just --list

# ── Setup ─────────────────────────────────────────────────────────────────────

# Install all dependencies; installs pre-commit hooks if inside a git repo
setup:
    pixi install
    git rev-parse --git-dir > /dev/null 2>&1 && pixi run pre-commit install || true
    @echo "✓ Environment ready. Run 'just serve' to start the server."

# ── Development ───────────────────────────────────────────────────────────────

# Start backend + Expo together; Ctrl-C stops both
dev:
    #!/usr/bin/env bash
    pixi run serve &
    BACKEND_PID=$!
    trap "kill $BACKEND_PID 2>/dev/null" EXIT
    cd client && npx expo start

# Start the FastAPI server on 0.0.0.0:8000 (reachable over Tailscale)
serve:
    pixi run serve

# ── Quality checks ────────────────────────────────────────────────────────────

# Run the full test suite (pass extra args: just test -k "test_foo")
test *ARGS:
    pixi run pytest server/tests/ -v {{ARGS}}

# Lint the codebase with ruff
lint:
    pixi run ruff check server/src/ server/tests/

# Auto-format the codebase with ruff
format:
    pixi run ruff format server/src/ server/tests/

# Run mypy type checks
typecheck:
    pixi run mypy server/src/

# Run all quality checks in sequence (lint → typecheck → test)
check: lint typecheck test

# ── Client ────────────────────────────────────────────────────────────────────

# Start the Expo dev client (requires Node/npm — separate from pixi)
client:
    cd client && npx expo start

# ── Utilities ─────────────────────────────────────────────────────────────────

# Remove caches and build artifacts (safe to run anytime)
clean:
    rm -rf build/ dist/ .pytest_cache/ .ruff_cache/ .mypy_cache/ .coverage server/.pytest_cache/
    find . -type d -name __pycache__ -exec rm -rf {} +
    find . -type f -name "*.pyc" -delete
    @echo "✓ Cleaned."

# Remove everything including dependencies (run 'just setup' + 'cd client && npm install' after)
clean-all: clean
    rm -rf .pixi/ client/node_modules/
    @echo "✓ Deep clean done. Run 'just setup' then 'cd client && npm install' to restore."

# Update all dependencies to latest compatible versions
update:
    pixi update
