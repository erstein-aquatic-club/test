# Application Windows (Electron)

Ce dossier fournit un emballage Electron pour exécuter le tableau de bord en natif sur Windows.

## Pré-requis
- Node.js 18+
- NPM

## Développement
1. Démarrer le front dans un terminal :
   ```bash
   cd ../pwa
   npm install
   npm run dev -- --host 0.0.0.0 --port 4173
   ```
2. Lancer l'application desktop dans un autre terminal :
   ```bash
   cd ../desktop
   npm install
   npm run start
   ```

## Build Windows (.exe)
```bash
cd ../desktop
npm install
npm run build
```

L'exécutable et l'installateur NSIS seront générés dans `apps/desktop/dist/`.
