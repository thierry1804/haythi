import { useCallback, useEffect, useState } from 'react';
import { apiGet } from './api';
import { useRoute } from './router';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import Leads from './pages/Leads';
import Login from './pages/Login';

type Session = { state: 'loading' } | { state: 'out' } | { state: 'in'; email: string };

export default function App() {
  const [session, setSession] = useState<Session>({ state: 'loading' });
  const route = useRoute();

  const refresh = useCallback(async () => {
    try {
      const me = await apiGet<{ email: string }>('/me');
      setSession({ state: 'in', email: me.email });
    } catch {
      setSession({ state: 'out' });
    }
  }, []);

  const signOut = useCallback(() => {
    window.location.hash = '/';
    setSession({ state: 'out' });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (session.state === 'loading') return <p className="muted pad">Chargement…</p>;
  if (session.state === 'out') return <Login onLoggedIn={() => void refresh()} />;

  const active = route.name === 'lead' ? 'leads' : route.name;

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Navigation">
        <div className="brand">HAYTHI Admin</div>
        <a href="#/" className={active === 'dashboard' ? 'active' : ''}>
          Tableau de bord
        </a>
        <a href="#/leads" className={active === 'leads' ? 'active' : ''}>
          Leads
        </a>
        <a href="#/account" className={active === 'account' ? 'active' : ''}>
          Compte
        </a>
      </nav>
      <main className="content">
        {route.name === 'dashboard' && <Dashboard onUnauthorized={signOut} />}
        {route.name === 'leads' && <Leads onUnauthorized={signOut} />}
        {route.name === 'lead' && <LeadDetail key={route.id} id={route.id} onUnauthorized={signOut} />}
        {route.name === 'account' && <Account email={session.email} onLoggedOut={signOut} />}
        {route.name === 'notfound' && (
          <>
            <h1>Page introuvable</h1>
            <a href="#/">Retour au tableau de bord</a>
          </>
        )}
      </main>
    </div>
  );
}
