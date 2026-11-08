export type LeadStatus = 'new' | 'in_progress' | 'replied' | 'closed' | 'spam';

export const STATUSES: LeadStatus[] = ['new', 'in_progress', 'replied', 'closed', 'spam'];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nouveau',
  in_progress: 'En cours',
  replied: 'Répondu',
  closed: 'Clôturé',
  spam: 'Spam',
};

export const EVENT_LABELS: Record<string, string> = {
  status: 'Changement de statut',
  reply: 'Réponse envoyée',
  anonymized: 'Lead anonymisé',
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status as LeadStatus] ?? status;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
}

export interface LeadSummary {
  id: string;
  created_at: string;
  status: LeadStatus;
  name: string;
  company: string;
  email: string;
  subject: string;
  lang: string;
  email_status: string | null;
}

export interface Lead extends LeadSummary {
  message: string;
}

export interface LeadEvent {
  id: string;
  lead_id: string;
  created_at: string;
  type: string;
  payload: Record<string, unknown> | null;
}
