import { useState } from 'react';
import { apiPost } from '../api';

export default function Account({ email, onLoggedOut }: { email: string; onLoggedOut: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setBusy(true);
    setError(null);
    try {
      await apiPost('/logout');
      onLoggedOut();
    } catch {
      setError('Déconnexion impossible');
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Compte</h1>
      <dl className="details">
        <dt>E-mail</dt>
        <dd>{email}</dd>
      </dl>
      {error && <p className="error">{error}</p>}
      <button type="button" className="btn" onClick={logout} disabled={busy}>
        Se déconnecter
      </button>
    </>
  );
}
