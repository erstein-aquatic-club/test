# Fridge Planner Monorepo (PWA + Apps Script)

## Structure
- `apps/pwa`: iOS-first PWA (Vite + React + TypeScript)
- `apps/gas-backend`: Google Apps Script Web App backend
- `docs`: setup, schema, and API contract

## PWA Setup
```bash
cd apps/pwa
npm install
npm run dev
```

## Backend Setup
Follow `docs/deploy.md` to provision Google Sheets + Apps Script and publish the Web App.

## Environment Variables
Create `apps/pwa/.env.local`:
```
VITE_BACKEND_URL=https://script.google.com/macros/s/XXX/exec
```

## Repo Policies
- No secrets in Git.
- iOS-first PWA; no barcode scanning for MVP.
