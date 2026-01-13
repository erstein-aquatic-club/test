import { ChangeEvent, useState } from 'react';

type ExcelConnectorProps = {
  onLoadPieces: (file: File) => void;
  onLoadSettings: (file: File) => void;
  onDownload: () => void;
  fileNames: { pieces: string; settings: string };
};

const ExcelConnector = ({ onLoadPieces, onLoadSettings, onDownload, fileNames }: ExcelConnectorProps) => {
  const [error, setError] = useState('');

  const handleChange =
    (handler: (file: File) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      if (!file.name.endsWith('.csv')) {
        setError('Merci de sélectionner un fichier CSV exporté depuis Excel.');
        return;
      }
      setError('');
      handler(file);
    };

  return (
    <div className="card">
      <h2>Connexion Excel</h2>
      <p className="muted">
        Importez vos exports CSV Excel (onglets <strong>Pieces</strong> et <strong>Reglages</strong>) et
        récupérez les versions mises à jour.
      </p>
      <div className="field-stack">
        <label>
          Fichier CSV - Pieces
          <input type="file" accept=".csv" onChange={handleChange(onLoadPieces)} />
        </label>
        <label>
          Fichier CSV - Reglages
          <input type="file" accept=".csv" onChange={handleChange(onLoadSettings)} />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button type="button" onClick={onDownload}>
          Télécharger les CSV mis à jour ({fileNames.pieces} / {fileNames.settings})
        </button>
      </div>
      <p className="hint">
        Excel ouvre facilement ces fichiers CSV : ré-importez-les ensuite dans votre classeur pour
        garder les deux feuilles synchronisées.
      </p>
    </div>
  );
};

export default ExcelConnector;
