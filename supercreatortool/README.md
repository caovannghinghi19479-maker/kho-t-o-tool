# SuperCreatorTool

Production-focused local desktop suite for AI-assisted video ideation and pipeline orchestration.

## 1) Prerequisites

- **Node.js**: 20+
- **Python**: 3.10+
- **ffmpeg**: available in PATH (`ffmpeg -version` must work)

## 2) Install

```bash
cd supercreatortool
npm install
cp apps/server/.env.example apps/server/.env
npm run prisma:generate
npm run prisma:migrate
python -m pip install -r workers/requirements.txt
```

## 3) Development launch

Open 3 terminals from `supercreatortool/`:

```bash
npm --workspace apps/server run dev
```

```bash
python workers/main.py
```

```bash
npm --workspace apps/renderer run dev
```

Then launch Electron shell:

```bash
npm --workspace apps/electron run dev
```

## 4) Packaging (Phase 3 sanity pass)

Build all app layers first:

```bash
npm run build
```

Run packaging sanity checks (verifies required dist artifacts before packaging):

```bash
npm run package:sanity
```

Create desktop installers (`.exe` via NSIS on Windows, `.dmg` on macOS):

```bash
npm run dist
```

## 5) Smoke test checklist

1. `GET http://localhost:4000/api/health` returns `{ ok: true }`.
2. `GET http://localhost:5001/worker/health` returns `{ success: true, data: { status: "ok" } }`.
3. Create a project in UI → confirm it appears in Projects list after refresh.
4. Queue one Text-to-Video job → verify Job Queue row changes `pending -> running -> done`.
5. Run Competitor Analyze with local video path → verify transcript/keyframes/analysis payload returned.
6. Save settings with Gemini key → DB stores masked key only; secret stored outside Prisma settings row.
