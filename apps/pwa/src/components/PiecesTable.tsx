import { useMemo, useState } from 'react';
import { PieceRecord } from '../types';

type PiecesTableProps = {
  pieces: PieceRecord[];
  zones: string[];
  recipients: string;
  onUpdate: (id: string, updates: Partial<PieceRecord>) => void;
};

const PiecesTable = ({ pieces, zones, recipients, onUpdate }: PiecesTableProps) => {
  const [filters, setFilters] = useState({ search: '', location: 'Toutes' });

  const filteredPieces = useMemo(() => {
    return pieces.filter((piece) => {
      const matchesLocation = filters.location === 'Toutes' || piece.currentLocation === filters.location;
      const searchValue = filters.search.toLowerCase();
      const matchesSearch =
        !searchValue ||
        [piece.partNumber, piece.serialNumber, piece.orderNumber, piece.designation]
          .join(' ')
          .toLowerCase()
          .includes(searchValue);
      return matchesLocation && matchesSearch;
    });
  }, [filters.location, filters.search, pieces]);

  const handleLocationChange = (piece: PieceRecord, newLocation: string) => {
    onUpdate(piece.id, {
      currentLocation: newLocation,
      lastUpdated: new Date().toLocaleString('fr-FR'),
    });
  };

  const handleRepatriation = (piece: PieceRecord) => {
    const subject = `Demande de rapatriement - ${piece.partNumber}`;
    const body = [
      `Bonjour,`,
      ``,
      `Merci de planifier le rapatriement de la pièce suivante vers l'emplacement initial : ${piece.initialLocation}.`,
      ``,
      `Part number : ${piece.partNumber}`,
      `Serial number : ${piece.serialNumber}`,
      `N° OT/OF : ${piece.orderNumber}`,
      `Désignation : ${piece.designation}`,
      `Emplacement actuel : ${piece.currentLocation}`,
      `Dernière mise à jour : ${piece.lastUpdated}`,
      piece.comment ? `Commentaire : ${piece.comment}` : '',
      ``,
      `Merci,`,
    ]
      .filter(Boolean)
      .join('\n');
    const mailto = `mailto:${encodeURIComponent(recipients)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
  };

  return (
    <section className="card">
      <h2>Suivi des pièces</h2>
      <div className="filters">
        <label>
          Recherche
          <input
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Part number, serial number, désignation..."
          />
        </label>
        <label>
          Emplacement
          <select
            value={filters.location}
            onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
          >
            <option value="Toutes">Toutes</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Pièce</th>
              <th>Ordre</th>
              <th>Emplacement</th>
              <th>Dernière mise à jour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPieces.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  Ajoutez une pièce ou chargez votre fichier Excel pour démarrer le suivi.
                </td>
              </tr>
            ) : (
              filteredPieces.map((piece) => (
                <tr key={piece.id}>
                  <td>
                    <strong>{piece.partNumber}</strong>
                    <div className="table-meta">SN: {piece.serialNumber}</div>
                    <div className="table-meta">{piece.designation}</div>
                  </td>
                  <td>
                    <div>{piece.orderNumber}</div>
                    {piece.comment ? <div className="table-meta">{piece.comment}</div> : null}
                  </td>
                  <td>
                    <select
                      value={piece.currentLocation}
                      onChange={(event) => handleLocationChange(piece, event.target.value)}
                    >
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                    <div className="table-meta">Initial: {piece.initialLocation}</div>
                  </td>
                  <td>{piece.lastUpdated}</td>
                  <td>
                    <button type="button" className="ghost" onClick={() => handleRepatriation(piece)}>
                      Demander rapatriement
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="hint">
        Les demandes de rapatriement utilisent les destinataires configurés dans l&apos;onglet{' '}
        <strong>Reglages</strong> de votre Excel.
      </p>
    </section>
  );
};

export default PiecesTable;
