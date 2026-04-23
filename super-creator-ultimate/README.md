# SuperCreatorUltimate (Legitimate Monorepo Base)

Production-ready starter monorepo for an Electron desktop automation platform with:

- Electron desktop shell
- React + Vite frontend
- Express + Prisma + SQLite backend
- Python FastAPI worker for media analysis
- pnpm workspaces + Turborepo

## Project Structure

```
super-creator-ultimate/
├── packages/
│   ├── electron/
│   ├── frontend/
│   ├── backend/
│   └── worker/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Python 3.11+
- ffmpeg available in `PATH`

## Install

```bash
pnpm install
```

## Backend setup

```bash
cd packages/backend
pnpm prisma:generate
pnpm prisma:migrate
```

## Worker setup

```bash
cd packages/worker
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

Set optional environment variables:

- `GEMINI_API_KEY` for official Gemini SDK use in worker
- `BACKEND_PORT` (default `8787`)
- `WORKER_PORT` (default `8001`)

## Run in development

In separate terminals:

```bash
# frontend
cd packages/frontend && pnpm dev

# backend
cd packages/backend && pnpm dev

# worker
cd packages/worker && python main.py

# electron
cd packages/electron && pnpm dev
```

## Build all packages

```bash
pnpm build
```

## Build desktop app

```bash
cd packages/electron
pnpm build
pnpm dist
```

## Notes

- Browser automation services in backend are intentionally safe placeholder flows.
- Extend automation services using official provider APIs and terms-compliant browser interactions.
- Persistent browser context + proxy support are implemented in `packages/electron/src/main/browserManager.ts`.
