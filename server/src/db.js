import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const MIGRATIONS_SQL = `
CREATE TABLE IF NOT EXISTS admin_user (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  totp_secret TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES admin_user(id),
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  lang TEXT NOT NULL,
  email_status TEXT,
  ip_hash TEXT
);

CREATE TABLE IF NOT EXISTS lead_events (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  created_at TEXT NOT NULL,
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS visits_daily (
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL,
  lang TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path, referrer_host, lang)
);
`;

/**
 * Open SQLite (WAL), run schema migrations, return the database handle.
 * @param {string} filePath
 * @returns {import('better-sqlite3').Database}
 */
export function openDb(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
  const db = new Database(filePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(MIGRATIONS_SQL);
  return db;
}
