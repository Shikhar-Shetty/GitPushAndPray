# Repository Guide

## Layout

- `frontend/` is the React 19 + TypeScript + Vite client. Start at [frontend/src/main.tsx](frontend/src/main.tsx), with the main UI in [frontend/src/App.tsx](frontend/src/App.tsx).
- `backend/` is a Python package using `uv`, `uv_build`, FastAPI, and Uvicorn. The package currently contains only [backend/src/backend/**init**.py](backend/src/backend/__init__.py).
- See [frontend/README.md](frontend/README.md) for the generated frontend notes and [backend/README.md](backend/README.md) for backend documentation when it is added.

## Commands

Run commands from the relevant project directory.

### Frontend

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

`npm run build` is also the frontend typecheck because it runs `tsc -b` before `vite build`. There is currently no frontend test script.

### Backend

```bash
uv sync
uv run backend
```

Python 3.14 or newer is required. There are currently no backend test, lint, or typecheck commands. `uv run backend` runs the package's greeting entry point; it does not start a FastAPI server until an application module and `app` object are added.

## Conventions

- Preserve `frontend/package-lock.json` and `backend/uv.lock` when changing dependencies.
- Follow the existing TypeScript settings in [frontend/tsconfig.app.json](frontend/tsconfig.app.json), including strict unused-local and unused-parameter checks and bundler module resolution.
- Keep frontend assets in `frontend/src/assets/` or `frontend/public/` according to how they are currently referenced.
- Keep Python source under the `backend/src/backend/` package layout.
- Prefer the existing Vite, React, TypeScript, Oxlint, `uv`, FastAPI, and Uvicorn toolchain over introducing alternatives without a clear need.

## Change Validation

For frontend changes, run `npm run lint` and `npm run build` from `frontend/`. For backend changes, run `uv sync` and `uv run backend` when applicable; add focused tests or tooling only when the backend gains behavior that needs them.
