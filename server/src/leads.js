import { randomUUID } from "node:crypto";

export const MIN_SUBMIT_MS = 2500;
export const MAX_SUBMIT_MS = 1000 * 60 * 60 * 6;

const EMAIL_STATUSES = new Set(["sent", "failed", "partial"]);

/** Heuristique anti-spam : retourne un code ou null. */
export function looksLikeSpam(data) {
  const message = data.message || "";
  const name = data.name || "";
  const urls = message.match(/https?:\/\/|www\./gi) || [];
  if (urls.length > 2) return "TOO_MANY_LINKS";

  // Bots: même contenu répété / caractères random
  if (/(.)\1{9,}/.test(message)) return "REPEATED_CHARS";
  if (/[\u0400-\u04FF]{20,}/.test(message) && !/[a-zA-ZÀ-ÿ]{3,}/.test(message)) {
    // gros bloc cyrillique seul → souvent spam
    return "SCRIPT_SPAM";
  }

  const spamWords = /\b(viagra|casino|crypto\s*invest|forex|seo\s*rank|buyer\s*list|nigerian\s*prince)\b/i;
  if (spamWords.test(message) || spamWords.test(name)) return "KEYWORD_SPAM";

  return null;
}

/**
 * Raison pour laquelle un contact est un faux-OK silencieux (honeypot, timing, spam),
 * ou null si le contact est légitime.
 */
export function contactRejectReason(data, { nodeEnv = "development", now = Date.now() } = {}) {
  if (data.website && data.website.trim() !== "") return "HONEYPOT";

  if (typeof data.startedAt === "number") {
    const elapsed = now - data.startedAt;
    if (elapsed < MIN_SUBMIT_MS || elapsed > MAX_SUBMIT_MS) return "TIMING";
  } else if (nodeEnv === "production") {
    return "MISSING_STARTED_AT";
  }

  const spamCode = looksLikeSpam(data);
  if (spamCode) return spamCode;

  return null;
}

export function shouldPersistContact(data, opts) {
  return contactRejectReason(data, opts) === null;
}

export function createLead(db, { name, company, email, subject, message, lang, ipHash }) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO leads (id, created_at, status, name, company, email, subject, message, lang, email_status, ip_hash)
     VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?, NULL, ?)`,
  ).run(id, new Date().toISOString(), name, company || "", email, subject, message, lang || "FR", ipHash ?? null);
  return { id };
}

export function setLeadEmailStatus(db, id, status) {
  if (!EMAIL_STATUSES.has(status)) {
    throw new Error(`Invalid email status: ${status}`);
  }
  db.prepare("UPDATE leads SET email_status = ? WHERE id = ?").run(status, id);
}

export function getLead(db, id) {
  return db.prepare("SELECT * FROM leads WHERE id = ?").get(id) ?? null;
}

export const LEAD_STATUSES = ["new", "in_progress", "replied", "closed", "spam"];
const LEAD_STATUS_SET = new Set(LEAD_STATUSES);

/** Colonnes de la liste (pas de message complet ni d'ip_hash). */
const LIST_COLUMNS =
  "id, created_at, status, name, company, email, subject, lang, email_status";

/**
 * Liste des leads, du plus récent au plus ancien.
 * @param {import('better-sqlite3').Database} db
 * @param {{ status?: string, limit?: number }} [opts]
 */
export function listLeads(db, { status, limit = 500 } = {}) {
  if (status !== undefined && !LEAD_STATUS_SET.has(status)) {
    throw new Error(`Invalid lead status: ${status}`);
  }
  const max = Math.min(Math.max(Math.trunc(Number(limit)) || 500, 1), 1000);
  if (status) {
    return db
      .prepare(
        `SELECT ${LIST_COLUMNS} FROM leads WHERE status = ? ORDER BY created_at DESC, rowid DESC LIMIT ?`,
      )
      .all(status, max);
  }
  return db
    .prepare(`SELECT ${LIST_COLUMNS} FROM leads ORDER BY created_at DESC, rowid DESC LIMIT ?`)
    .all(max);
}

/** Nombre exact de leads (filtre de statut optionnel), indépendant du plafond de listLeads. */
export function countLeads(db, { status } = {}) {
  if (status !== undefined && !LEAD_STATUS_SET.has(status)) {
    throw new Error(`Invalid lead status: ${status}`);
  }
  const row = status
    ? db.prepare("SELECT COUNT(*) AS n FROM leads WHERE status = ?").get(status)
    : db.prepare("SELECT COUNT(*) AS n FROM leads").get();
  return row.n;
}

/** Ajoute un événement à l'historique d'un lead. */
export function addEvent(db, leadId, type, payload = {}) {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO lead_events (id, lead_id, created_at, type, payload_json) VALUES (?, ?, ?, ?, ?)",
  ).run(id, leadId, new Date().toISOString(), type, JSON.stringify(payload));
  return { id };
}

export function listEvents(db, leadId) {
  return db
    .prepare("SELECT * FROM lead_events WHERE lead_id = ? ORDER BY created_at ASC, rowid ASC")
    .all(leadId)
    .map((e) => ({ ...e, payload: safeParse(e.payload_json) }));
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Change le statut et journalise l'événement `status`.
 * @returns {{ from: string, to: string } | null} null si le lead n'existe pas
 */
export function updateStatus(db, id, status) {
  if (!LEAD_STATUS_SET.has(status)) {
    throw new Error(`Invalid lead status: ${status}`);
  }
  return db.transaction(() => {
    const lead = getLead(db, id);
    if (!lead) return null;
    db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, id);
    addEvent(db, id, "status", { from: lead.status, to: status });
    return { from: lead.status, to: status };
  })();
}

/** Un lead anonymisé n'a plus d'email. */
export function isAnonymized(lead) {
  return !lead.email;
}

/**
 * Export RGPD (droit d'accès) : lead complet + historique.
 * @returns {{ lead: object, events: object[] } | null}
 */
export function exportLead(db, id) {
  const lead = getLead(db, id);
  if (!lead) return null;
  return { lead, events: listEvents(db, id) };
}

/**
 * Anonymisation RGPD : efface les données personnelles du lead, expurge le
 * contenu des événements (réponses envoyées) et journalise `anonymized`.
 * @returns {boolean} false si le lead n'existe pas
 */
export function anonymizeLead(db, id) {
  return db.transaction(() => {
    const lead = getLead(db, id);
    if (!lead) return false;
    db.prepare(
      "UPDATE leads SET name = '', email = '', company = '', message = '', ip_hash = NULL WHERE id = ?",
    ).run(id);
    db.prepare("UPDATE lead_events SET payload_json = ? WHERE lead_id = ? AND type = 'reply'").run(
      JSON.stringify({ redacted: true }),
      id,
    );
    addEvent(db, id, "anonymized", {});
    return true;
  })();
}

/** Suppression définitive du lead et de son historique. */
export function deleteLead(db, id) {
  return db.transaction(() => {
    db.prepare("DELETE FROM lead_events WHERE lead_id = ?").run(id);
    return db.prepare("DELETE FROM leads WHERE id = ?").run(id).changes > 0;
  })();
}
