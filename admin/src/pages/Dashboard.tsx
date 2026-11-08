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
      apiGet<{ leads: LeadSummary[] }>('/leads?status=new'),
    ])
      .then(([s7, s30, leads]) => {
        if (!alive) return;
        setStats7(s7);
        setStats30(s30);
        setNewLeads(leads.leads.length);
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
  if (!stats7 || !stats30 || newLeads === null) return <p className="muted">Chargement…</p>;

  return (
    <>
      <h1>Tableau de bord</h1>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{newLeads}</div>
          <div className="muted">Leads nouveaux</div>
          <a href="#/leads">Voir les leads</a>
        </div>
        <div className="stat">
          <div className="stat-value">{total(stats7)}</div>
          <div className="muted">Visites sur 7 jours</div>
        </div>
        <div className="stat">
          <div className="stat-value">{total(stats30)}</div>
          <div className="muted">Visites sur 30 jours</div>
        </div>
      </div>

      <div className="columns">
        <section>
          <h2>Visites par jour (7 jours)</h2>
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
                  <td className="num">{d.hits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h2>Principales sources (30 jours)</h2>
          {stats30.topReferrers.length === 0 ? (
            <p className="muted">Aucune source externe</p>
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
    </>
  );
}
