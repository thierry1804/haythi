import { useEffect, useState } from 'react';
import { ApiError, apiGet } from '../api';
import { formatDate, protocolLabel, STATUSES, statusLabel } from '../labels';
import type { LeadSummary } from '../labels';

export default function Leads({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [status, setStatus] = useState('');
  const [leads, setLeads] = useState<LeadSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLeads(null);
    setError(null);
    apiGet<{ leads: LeadSummary[] }>(`/leads${status ? `?status=${status}` : ''}`)
      .then((r) => alive && setLeads(r.leads))
      .catch((err) => {
        if (!alive) return;
        if (err instanceof ApiError && err.status === 401) onUnauthorized();
        else setError('Impossible de charger les leads');
      });
    return () => {
      alive = false;
    };
  }, [status, onUnauthorized]);

  return (
    <>
      <div className="page-head">
        <h1>Leads</h1>
        <label className="inline-field">
          <span>Statut</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tous</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}
      {!error && leads === null && <p className="muted">Chargement…</p>}
      {leads && leads.length === 0 && <p className="muted">Aucun lead</p>}
      {leads && leads.length > 0 && (
        <table className="clickable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Sujet</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="nowrap">{formatDate(l.created_at)}</td>
                <td>
                  <a href={`#/leads/${encodeURIComponent(l.id)}`}>
                    {l.name || <em className="muted">Anonymisé</em>}
                  </a>
                  {l.company && <div className="muted">{l.company}</div>}
                </td>
                <td>{protocolLabel(l.subject)}</td>
                <td className="nowrap">{statusLabel(l.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
