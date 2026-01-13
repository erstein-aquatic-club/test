import { ExcelSettings } from '../types';

type SettingsPanelProps = {
  settings: ExcelSettings;
  onChange: (settings: ExcelSettings) => void;
};

const SettingsPanel = ({ settings, onChange }: SettingsPanelProps) => {
  return (
    <div className="card">
      <h2>Paramètres de zones & destinataires</h2>
      <p className="muted">
        Modifiez les libellés de zones et la liste des destinataires. Ces valeurs seront sauvegardées
        dans l&apos;onglet <strong>Reglages</strong> du fichier Excel.
      </p>
      <div className="grid two">
        <label>
          Zone A (initiale)
          <input
            value={settings.zoneA}
            onChange={(event) => onChange({ ...settings, zoneA: event.target.value })}
            placeholder="Zone A"
          />
        </label>
        <label>
          Zone B
          <input
            value={settings.zoneB}
            onChange={(event) => onChange({ ...settings, zoneB: event.target.value })}
            placeholder="Zone B"
          />
        </label>
      </div>
      <label>
        Destinataires (séparés par des virgules)
        <input
          value={settings.recipients}
          onChange={(event) => onChange({ ...settings, recipients: event.target.value })}
          placeholder="atelier@example.com, logistique@example.com"
        />
      </label>
    </div>
  );
};

export default SettingsPanel;
