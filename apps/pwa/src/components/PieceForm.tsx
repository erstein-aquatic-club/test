import { FormEvent, useState } from 'react';
import { PieceRecord } from '../types';

type PieceFormProps = {
  zones: string[];
  onAdd: (piece: PieceRecord) => void;
};

const PieceForm = ({ zones, onAdd }: PieceFormProps) => {
  const [partNumber, setPartNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [comment, setComment] = useState('');
  const [currentLocation, setCurrentLocation] = useState(zones[0] ?? 'Zone A');
  const [initialLocation, setInitialLocation] = useState(zones[0] ?? 'Zone A');

  const resetForm = () => {
    setPartNumber('');
    setSerialNumber('');
    setOrderNumber('');
    setDesignation('');
    setComment('');
    setCurrentLocation(zones[0] ?? 'Zone A');
    setInitialLocation(zones[0] ?? 'Zone A');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partNumber || !serialNumber || !orderNumber || !designation) {
      return;
    }

    const now = new Date().toLocaleString('fr-FR');
    onAdd({
      id: crypto.randomUUID(),
      partNumber,
      serialNumber,
      orderNumber,
      designation,
      comment,
      currentLocation,
      initialLocation,
      lastUpdated: now,
    });
    resetForm();
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Nouvelle pièce / expédition</h2>
      <p className="muted">
        Saisissez les informations minimales pour suivre une expédition entre les zones et garder
        l&apos;emplacement à jour.
      </p>
      <div className="grid two">
        <label>
          Part number *
          <input value={partNumber} onChange={(event) => setPartNumber(event.target.value)} required />
        </label>
        <label>
          Serial number *
          <input
            value={serialNumber}
            onChange={(event) => setSerialNumber(event.target.value)}
            required
          />
        </label>
        <label>
          N° OT/OF *
          <input
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            required
          />
        </label>
        <label>
          Désignation *
          <input
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
            required
          />
        </label>
        <label>
          Emplacement initial
          <select value={initialLocation} onChange={(event) => setInitialLocation(event.target.value)}>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
        <label>
          Emplacement actuel
          <select value={currentLocation} onChange={(event) => setCurrentLocation(event.target.value)}>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Commentaire (optionnel)
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} />
      </label>
      <button type="submit">Ajouter la pièce</button>
    </form>
  );
};

export default PieceForm;
