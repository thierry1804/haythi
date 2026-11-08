import { useEffect, useState } from 'react';

/** Routeur minimal basé sur le hash (#/leads/abc) : aucun changement de config nginx requis. */

export type Route =
  | { name: 'dashboard' }
  | { name: 'leads' }
  | { name: 'lead'; id: string }
  | { name: 'account' }
  | { name: 'notfound' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').split('?')[0].replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'dashboard' };
  if (parts[0] === 'leads' && parts.length === 1) return { name: 'leads' };
  if (parts[0] === 'leads' && parts.length === 2) {
    return { name: 'lead', id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === 'account' && parts.length === 1) return { name: 'account' };
  return { name: 'notfound' };
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
