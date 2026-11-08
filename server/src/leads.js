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
