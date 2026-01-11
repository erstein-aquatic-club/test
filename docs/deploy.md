# Déploiement Apps Script + Sheets

## 1) Créer le Google Sheet
- Créez un Google Sheet et ajoutez les onglets + colonnes décrits dans `docs/sheets-schema.md`.
- Ajoutez une première ligne de test dans `Users` (tokenHash généré côté backend).

Pour générer un `tokenHash`, ouvrez Apps Script → Executions → Run et utilisez:
```javascript
Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'mon-token'))
```

## 2) Créer le projet Apps Script
- Ouvrez Extensions → Apps Script.
- Copiez les fichiers de `apps/gas-backend/src` dans le projet.
- Ajoutez `appsscript.json`.

## 3) Configurer les secrets
Dans Apps Script → Project Settings → Script Properties:
- `OPENAI_API_KEY` = clé OpenAI

## 4) Publier en Web App
- Deploy → New deployment → Web app.
- Execute as: `Me`.
- Who has access: `Anyone` (or `Anyone with link`).
- Copiez l'URL pour `VITE_BACKEND_URL`.

## 5) Bonnes pratiques / quotas
- Apps Script est limité en temps d'exécution et en quotas d'URLFetch.
- Gardez un appel IA par génération de semaine.
- Utilisez `LockService` pour les écritures concurrentes.

## Tester via curl
```bash
curl -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"auth.ping","userId":"user_123","token":"plain-token","payload":{}}'
```

```bash
curl -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"inventory.list","userId":"user_123","token":"plain-token","payload":{}}'
```
