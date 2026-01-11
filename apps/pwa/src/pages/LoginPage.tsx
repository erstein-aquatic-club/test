import { useState } from 'react';
import { saveAuth } from '../services/storage';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [householdId, setHouseholdId] = useState('');
  const [saved, setSaved] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveAuth({ userId, token, householdId: householdId || undefined });
    setSaved(true);
  };

  return (
    <section className="card">
      <h2>Connexion</h2>
      <p>Stocke localement vos identifiants d'accès.</p>
      <form className="grid" onSubmit={onSubmit}>
        <label>
          User ID
          <input value={userId} onChange={(event) => setUserId(event.target.value)} required />
        </label>
        <label>
          Token
          <input value={token} onChange={(event) => setToken(event.target.value)} required type="password" />
        </label>
        <label>
          Household ID (optionnel)
          <input value={householdId} onChange={(event) => setHouseholdId(event.target.value)} />
        </label>
        <button type="submit">Enregistrer</button>
        {saved && <span>Identifiants enregistrés ✅</span>}
      </form>
    </section>
  );
};

export default LoginPage;
