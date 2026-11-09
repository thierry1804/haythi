import { useState, type FormEvent } from 'react';
import { ApiError, apiPost } from '../api';

const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Identifiants ou code TOTP invalides',
  rate_limit: 'Trop de tentatives. Réessayez dans quelques minutes.',
  invalid_payload: 'Formulaire incomplet',
};

export default function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiPost('/login', { email, password, totp });
      onLoggedIn();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(MESSAGES[err.message] ?? 'Connexion impossible');
      } else {
        setError('Erreur réseau');
      }
      setPassword('');
      setTotp('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <form className="login-form" onSubmit={onSubmit}>
        <h1 className="login-brand">HAYTHI</h1>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <label className="field">
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Code TOTP</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn block" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
