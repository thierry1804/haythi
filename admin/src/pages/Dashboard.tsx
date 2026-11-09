import { useEffect, useState } from 'react';
import { ApiError, apiGet } from '../api';
import { formatDay } from '../labels';
import type { LeadSummary } from '../labels';

interface VisitStats {
  days: { day: string; hits: number }[];
  topReferrers: { host: string; hits: number }[];
}

const total = (s: VisitStats) => s.days.reduce((n, d) => n + d.hits, 0);

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
          <h2>Sources</h2>
          {stats30.topReferrers.length === 0 ? (
            <p className="empty">Aucune source externe</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th className="num">Visites</th>
                </tr>
              </thead>
              <tbody>
                {stats30.topReferrers.map((r) => (
                  <tr key={r.host}>
                    <td>{r.host}</td>
                    <td className="num">{r.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
