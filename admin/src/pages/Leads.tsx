import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { ApiError, apiGet } from '../api';
import { formatDate, protocolLabel, STATUSES, statusLabel } from '../labels';
import type { LeadSummary } from '../labels';
import { navigate } from '../router';

function openLead(id: string) {
  navigate(`/leads/${encodeURIComponent(id)}`);
}

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

  const onRowClick = (e: MouseEvent<HTMLTableRowElement>, id: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, select, input, textarea, label')) return;
    openLead(id);
  };

  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLead(id);
    }
  };

  return (
    <div className="page">
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
      {leads && leads.length === 0 && <p className="empty">Aucun lead</p>}
      {leads && leads.length > 0 && (
        <div className="table-wrap">
          <table className="clickable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Contact</th>
                <th>Sujet</th>
                <th>Statut</th>
                <th className="num">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr
                  key={l.id}
                  tabIndex={0}
                  className="lead-row"
                  onClick={(e) => onRowClick(e, l.id)}
                  onKeyDown={(e) => onRowKey(e, l.id)}
                >
                  <td className="nowrap">{formatDate(l.created_at)}</td>
                  <td>
                    <div className="lead-name">{l.name || <em className="muted">Anonymisé</em>}</div>
                    {l.company && <div className="muted">{l.company}</div>}
                    {l.email && <div className="muted">{l.email}</div>}
                  </td>
                  <td>{protocolLabel(l.subject)}</td>
                  <td className={`nowrap status-${l.status}`}>{statusLabel(l.status)}</td>
                  <td className="num">
                    <a
                      className="btn secondary btn-compact"
                      href={`#/leads/${encodeURIComponent(l.id)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Traiter
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
