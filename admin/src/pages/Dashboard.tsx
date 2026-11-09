import { useEffect, useState } from 'react';
import { ApiError, apiGet } from '../api';
import { formatDate, formatDay } from '../labels';
import type { LeadSummary } from '../labels';

interface VisitStats {
  days: { day: string; hits: number }[];
  topReferrers: { host: string; hits: number }[];
  directHits: number;
  topPaths: { path: string; hits: number }[];
  langs: { lang: string; hits: number }[];
  countries?: { code: string; hits: number }[];
  recent?: {
    id: number;
    created_at: string;
    ip: string;
    country: string;
    path: string;
    referrer_host: string;
    lang: string;
    user_agent: string;
  }[];
}

const total = (s: VisitStats) => s.days.reduce((n, d) => n + d.hits, 0);

function langLabel(lang: string) {
  if (lang === 'FR') return 'Français';
  if (lang === 'EN') return 'Anglais';
  return 'Non précisée';
}

function pathLabel(path: string) {
  return path === '/' ? '/ (accueil)' : path;
}

const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' });

function countryLabel(code: string) {
  if (!code) return 'Inconnu';
  if (code === 'T1') return 'Tor';
  try {
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}

function browserLabel(ua: string) {
  if (!ua) return '—';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Chrome/') && !ua.includes('Chromium')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return ua.slice(0, 40);
}

export default function Dashboard({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [stats7, setStats7] = useState<VisitStats | null>(null);
  const [stats30, setStats30] = useState<VisitStats | null>(null);
  const [newLeads, setNewLeads] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      apiGet<VisitStats>('/stats/visits?days=7'),
      apiGet<VisitStats>('/stats/visits?days=30'),
      apiGet<{ leads: LeadSummary[]; total?: number }>('/leads?status=new'),
    ])
      .then(([s7, s30, leads]) => {
        if (!alive) return;
        setStats7(s7);
        setStats30(s30);
        setNewLeads(leads.total ?? leads.leads.length);
      })
      .catch((err) => {
        if (!alive) return;
        if (err instanceof ApiError && err.status === 401) onUnauthorized();
        else setError('Impossible de charger les statistiques');
      });
    return () => {
      alive = false;
    };
  }, [onUnauthorized]);

  if (error) return <p className="error">{error}</p>;
  if (!stats7 || !stats30 || newLeads === null) {
    return (
      <div className="page">
        <h1>Tableau de bord</h1>
        <p className="muted">Chargement…</p>
      </div>
    );
  }

  const peak = stats7.days.reduce((n, d) => Math.max(n, d.hits), 0);
  const directHits = stats7.directHits ?? 0;
  const topPaths = stats7.topPaths ?? [];
  const langs = stats7.langs ?? [];
  const countries = stats7.countries ?? [];
  const recent = stats7.recent ?? [];
  const detailPending = countries.length === 0 && recent.length === 0 && total(stats7) > 0;

  return (
    <div className="page">
      <h1>Tableau de bord</h1>

      <section className="meter" aria-label="Résumé">
        <a className="meter-item" href="#/leads">
          <span className="meter-value">{newLeads}</span>
          <span className="meter-label">Leads nouveaux</span>
        </a>
        <div className="meter-item">
          <span className="meter-value">{total(stats7)}</span>
          <span className="meter-label">Visites, 7 jours</span>
        </div>
        <div className="meter-item">
          <span className="meter-value">{total(stats30)}</span>
          <span className="meter-label">Visites, 30 jours</span>
        </div>
      </section>

      <div className="split">
        <section className="panel">
          <h2>Visites par jour</h2>
          <table>
            <thead>
              <tr>
                <th>Jour</th>
                <th className="num">Visites</th>
              </tr>
            </thead>
            <tbody>
              {stats7.days.map((d) => (
                <tr key={d.day}>
                  <td>{formatDay(d.day)}</td>
                  <td>
                    <div className="hit">
                      <span className="hit-track" aria-hidden="true">
                        <span
                          className="hit-bar"
                          style={{ width: peak ? `${(d.hits / peak) * 100}%` : '0%' }}
                        />
                      </span>
                      <span className="hit-count">{d.hits}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="panel">
          <h2>Sources, 7 jours</h2>
          {total(stats7) === 0 ? (
            <p className="empty">Aucune visite</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th className="num">Visites</th>
                  </tr>
                </thead>
                <tbody>
                  {directHits > 0 && (
                    <tr>
                      <td>Accès direct</td>
                      <td className="num">{directHits}</td>
                    </tr>
                  )}
                  {stats7.topReferrers.map((r) => (
                    <tr key={r.host}>
                      <td>{r.host}</td>
                      <td className="num">{r.hits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stats7.topReferrers.length === 0 && (
                <p className="muted">
                  Aucun site d’origine transmis. Adresse saisie, favori, ou referrer masqué par le navigateur.
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <div className="split panel-space">
        <section className="panel">
          <h2>Pages, 7 jours</h2>
          {topPaths.length === 0 ? (
            <p className="empty">Aucune visite</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th className="num">Visites</th>
                </tr>
              </thead>
              <tbody>
                {topPaths.map((p) => (
                  <tr key={p.path}>
                    <td>{pathLabel(p.path)}</td>
                    <td className="num">{p.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className="panel">
          <h2>Langues, 7 jours</h2>
          {langs.length === 0 ? (
            <p className="empty">Aucune visite</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Langue</th>
                  <th className="num">Visites</th>
                </tr>
              </thead>
              <tbody>
                {langs.map((l) => (
                  <tr key={l.lang || 'unknown'}>
                    <td>{langLabel(l.lang)}</td>
                    <td className="num">{l.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="panel panel-space">
          <h2>Pays, 7 jours</h2>
          {countries.length === 0 ? (
            <p className="empty">{detailPending ? 'Pas encore de pays enregistré' : 'Aucune visite'}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pays</th>
                  <th className="num">Visites</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.code || 'unknown'}>
                    <td>{countryLabel(c.code)}</td>
                    <td className="num">{c.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {detailPending && (
            <p className="muted">
              Pays, IP, heure et navigateur sont enregistrés à partir de cette version. Les visites déjà comptées n’ont pas ces données.
            </p>
          )}
      </section>

      <section className="panel panel-space visit-log">
        <h2>Dernières visites</h2>
        {recent.length === 0 ? (
          <p className="empty">{detailPending ? 'Aucune ligne détaillée' : 'Aucune visite'}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quand</th>
                  <th>Pays</th>
                  <th>IP</th>
                  <th>Page</th>
                  <th>Langue</th>
                  <th>Source</th>
                  <th>Navigateur</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((v) => (
                  <tr key={v.id}>
                    <td className="nowrap">{formatDate(v.created_at)}</td>
                    <td>{countryLabel(v.country)}</td>
                    <td className="nowrap">{v.ip || '—'}</td>
                    <td>{pathLabel(v.path)}</td>
                    <td>{langLabel(v.lang)}</td>
                    <td>{v.referrer_host || 'Accès direct'}</td>
                    <td className="ua" title={v.user_agent}>
                      {browserLabel(v.user_agent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
