import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ApiError, apiDelete, apiDownload, apiGet, apiPatch, apiPost } from '../api';
import { EVENT_LABELS, formatDate, STATUSES, statusLabel } from '../labels';
import type { Lead, LeadEvent, LeadStatus } from '../labels';
import { navigate } from '../router';

const ERRORS: Record<string, string> = {
  anonymized: 'Ce lead est anonymisé : impossible de répondre',
  upstream_throw: "L'envoi de l'e-mail a échoué",
  upstream_rejected: "L'envoi de l'e-mail a été refusé",
  server_config: "L'envoi d'e-mails n'est pas configuré",
  invalid_payload: 'Objet et message obligatoires',
  not_found: 'Lead introuvable',
};

function describe(err: unknown): string {
  if (err instanceof ApiError) return ERRORS[err.message] ?? 'Action impossible';
  return 'Erreur réseau';
}

function eventDetail(e: LeadEvent): string {
  const p = e.payload;
  if (!p) return '';
  if (e.type === 'status') return `${statusLabel(String(p.from))} → ${statusLabel(String(p.to))}`;
  if (e.type === 'reply') {
    if (p.redacted) return 'Contenu effacé';
    return `${String(p.subject ?? '')} (${String(p.by ?? '')})`;
  }
  return '';
}

export default function LeadDetail({
  id,
  onUnauthorized,
}: {
  id: string;
  onUnauthorized: () => void;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) onUnauthorized();
      else setActionError(describe(err));
    },
    [onUnauthorized],
  );

  const load = useCallback(async () => {
    try {
      const r = await apiGet<{ lead: Lead; events: LeadEvent[] }>(`/leads/${encodeURIComponent(id)}`);
      setLead(r.lead);
      setEvents(r.events);
      setSubject((s) => s || (r.lead.subject ? `Re: ${r.lead.subject}` : ''));
      setLoadError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onUnauthorized();
      else setLoadError(describe(err));
    }
  }, [id, onUnauthorized]);

  useEffect(() => {
    setLead(null);
    setNotice(null);
    setActionError(null);
    setSubject('');
    setText('');
    void load();
  }, [load]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setActionError(null);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  const changeStatus = (status: LeadStatus) =>
    run(async () => {
      await apiPatch(`/leads/${encodeURIComponent(id)}`, { status });
      await load();
      setNotice('Statut mis à jour');
    });

  const sendReply = (e: FormEvent) => {
    e.preventDefault();
    return run(async () => {
      if (!window.confirm(`Envoyer cette réponse à ${lead?.email} ?`)) return;
      await apiPost(`/leads/${encodeURIComponent(id)}/reply`, { subject, text });
      setText('');
      await load();
      setNotice('Réponse envoyée');
    });
  };

  const exportLead = () =>
    run(async () => {
      await apiDownload(`/leads/${encodeURIComponent(id)}/export`, `lead-${id}.json`);
    });

  const anonymize = () =>
    run(async () => {
      if (
        !window.confirm(
          'Anonymiser ce lead ? Nom, e-mail, société et message seront effacés définitivement.',
        )
      ) {
        return;
      }
      await apiPost(`/leads/${encodeURIComponent(id)}/anonymize`);
      await load();
      setNotice('Lead anonymisé');
    });

  const remove = () =>
    run(async () => {
      if (!window.confirm('Supprimer définitivement ce lead et son historique ?')) return;
      await apiDelete(`/leads/${encodeURIComponent(id)}`);
      navigate('/leads');
    });

  if (loadError) {
    return (
      <>
        <p className="error">{loadError}</p>
        <a href="#/leads">Retour aux leads</a>
      </>
    );
  }
  if (!lead) return <p className="muted">Chargement…</p>;

  const anonymized = !lead.email;

  return (
    <>
      <p>
        <a href="#/leads">← Leads</a>
      </p>
      <div className="page-head">
        <h1>{anonymized ? 'Lead anonymisé' : lead.name}</h1>
        <label className="inline-field">
          <span>Statut</span>
          <select
            value={lead.status}
            disabled={busy}
            onChange={(e) => void changeStatus(e.target.value as LeadStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {lead.status === 'closed' && (
        <div className="banner" role="status">
          <span>Supprimer ce lead — rétention terminée</span>
          <button type="button" className="btn danger" onClick={() => void remove()} disabled={busy}>
            Supprimer
          </button>
        </div>
      )}

      {actionError && (
        <p className="error" role="alert">
          {actionError}
        </p>
      )}
      {notice && <p className="ok">{notice}</p>}

      <dl className="details">
        <dt>Date</dt>
        <dd>{formatDate(lead.created_at)}</dd>
        <dt>E-mail</dt>
        <dd>{lead.email || '—'}</dd>
        <dt>Société</dt>
        <dd>{lead.company || '—'}</dd>
        <dt>Langue</dt>
        <dd>{lead.lang}</dd>
        <dt>Sujet</dt>
        <dd>{lead.subject}</dd>
        <dt>Message</dt>
        <dd className="message">{lead.message || '—'}</dd>
      </dl>

      <h2>Répondre</h2>
      {anonymized ? (
        <p className="muted">Réponse impossible : lead anonymisé.</p>
      ) : (
        <form className="reply" onSubmit={(e) => void sendReply(e)}>
          <label className="field">
            <span>Objet</span>
            <input
              type="text"
              value={subject}
              maxLength={300}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea
              rows={8}
              value={text}
              maxLength={10000}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn" disabled={busy || !subject.trim() || !text.trim()}>
            Envoyer
          </button>
        </form>
      )}

      <h2>Données personnelles</h2>
      <div className="actions">
        <button type="button" className="btn secondary" onClick={() => void exportLead()} disabled={busy}>
          Exporter
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => void anonymize()}
          disabled={busy || anonymized}
        >
          Anonymiser
        </button>
        <button type="button" className="btn danger" onClick={() => void remove()} disabled={busy}>
          Supprimer
        </button>
      </div>

      <h2>Historique</h2>
      {events.length === 0 ? (
        <p className="muted">Aucun événement</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Événement</th>
              <th>Détail</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td className="nowrap">{formatDate(e.created_at)}</td>
                <td>{EVENT_LABELS[e.type] ?? e.type}</td>
                <td>{eventDetail(e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
