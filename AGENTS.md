# Agent Instructions

## Architecture
- PWA (iOS-first) → Apps Script Web App (JSON API) → Google Sheets → OpenAI (backend only).
- Never expose API keys in the PWA or Git; use Apps Script PropertiesService.

## Conventions
- TypeScript + React for the PWA.
- Keep components small and colocated in `apps/pwa/src`.
- Use descriptive, scoped commit messages (e.g., `pwa: add routing shell`).

## Commands
- PWA dev server: `npm install && npm run dev` in `apps/pwa`.
- PWA build: `npm run build` in `apps/pwa`.

## Security
- Never store keys client-side or in Git.
- Ignore `.clasprc.json`, `.env*`, and build artifacts.

## MVP Decisions
- No barcode scanning for iOS PWA MVP.
- One AI call per weekly plan generation.
- Persist the weekly plan in Sheets.
