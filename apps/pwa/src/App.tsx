import { useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import ExcelConnector from './components/ExcelConnector';
import PieceForm from './components/PieceForm';
import PiecesTable from './components/PiecesTable';
import SettingsPanel from './components/SettingsPanel';
import { buildPiecesCsv, buildSettingsCsv, downloadCsv, parsePiecesCsv, parseSettingsCsv } from './services/csv';
import { ExcelSettings, PieceRecord } from './types';

const defaultSettings: ExcelSettings = {
  zoneA: 'Zone A',
  zoneB: 'Zone B',
  recipients: '',
};

const App = () => {
  const [pieces, setPieces] = useState<PieceRecord[]>([]);
  const [settings, setSettings] = useState<ExcelSettings>(defaultSettings);
  const [fileNames, setFileNames] = useState({ pieces: 'pieces.csv', settings: 'reglages.csv' });

  const zones = useMemo(() => [settings.zoneA, settings.zoneB], [settings.zoneA, settings.zoneB]);

  const handlePiecesLoad = async (file: File) => {
    const content = await file.text();
    const loadedPieces = parsePiecesCsv(content);
    setPieces(loadedPieces);
    setFileNames((current) => ({ ...current, pieces: file.name }));
  };

  const handleSettingsLoad = async (file: File) => {
    const content = await file.text();
    const loadedSettings = parseSettingsCsv(content);
    setSettings((current) => ({
      ...current,
      ...loadedSettings,
    }));
    setFileNames((current) => ({ ...current, settings: file.name }));
  };

  const handlePieceAdd = (piece: PieceRecord) => {
    setPieces((current) => [piece, ...current]);
  };

  const handlePieceUpdate = (id: string, updates: Partial<PieceRecord>) => {
    setPieces((current) =>
      current.map((piece) => (piece.id === id ? { ...piece, ...updates } : piece)),
    );
  };

  const handleDownload = () => {
    downloadCsv(buildPiecesCsv(pieces), fileNames.pieces.endsWith('.csv') ? fileNames.pieces : `${fileNames.pieces}.csv`);
    downloadCsv(
      buildSettingsCsv(settings),
      fileNames.settings.endsWith('.csv') ? fileNames.settings : `${fileNames.settings}.csv`,
    );
  };

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <section className="grid two">
          <ExcelConnector
            onLoadPieces={handlePiecesLoad}
            onLoadSettings={handleSettingsLoad}
            onDownload={handleDownload}
            fileNames={fileNames}
          />
          <SettingsPanel settings={settings} onChange={setSettings} />
        </section>
        <section className="grid two">
          <PieceForm zones={zones} onAdd={handlePieceAdd} />
          <div className="card">
            <h2>Récapitulatif</h2>
            <p className="muted">
              {pieces.length} pièce{pieces.length > 1 ? 's' : ''} enregistrée
              {pieces.length > 1 ? 's' : ''}. Dernière mise à jour synchronisée avec vos exports
              Excel.
            </p>
            <ul className="summary-list">
              {zones.map((zone) => (
                <li key={zone}>
                  <span className="summary-label">{zone}</span>
                  <strong>
                    {pieces.filter((piece) => piece.currentLocation === zone).length}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <PiecesTable
          pieces={pieces}
          zones={zones}
          recipients={settings.recipients}
          onUpdate={handlePieceUpdate}
        />
      </main>
    </div>
  );
};

export default App;
