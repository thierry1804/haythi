import argon2 from "argon2";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { parseCookie, stringifySetCookie } from "cookie";
import * as OTPAuth from "otpauth";

export const COOKIE_NAME = "haythi_admin";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOTP_ISSUER = "Haythi Admin";

/** @param {string} password */
export function hashPassword(password) {
  return argon2.hash(password, { type: argon2.argon2id });
}

/**
 * @param {string} hash
 * @param {string} password
 */
export async function verifyPassword(hash, password) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

function hashToken(token) {
  const key = process.env.SESSION_SECRET || "haythi-session";
  return createHmac("sha256", key).update(token).digest("hex");
}

/**
 * Create a session row (only the token hash is stored) and return the raw token.
 * @param {import('better-sqlite3').Database} db
 * @param {string} userId
 * @returns {string}
 */
export function createSession(db, userId) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.prepare(
    "INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
  ).run(
    randomUUID(),
    userId,
    hashToken(token),
    new Date(now).toISOString(),
    new Date(now + SESSION_TTL_MS).toISOString(),
  );
  return token;
}

/**
 * @param {import('better-sqlite3').Database} db
 * @param {string} token
 */
export function destroySession(db, token) {
  db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
}

/** Set-Cookie header value for a session token. */
export function sessionCookie(token, { maxAgeMs = SESSION_TTL_MS } = {}) {
  return stringifySetCookie({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  });
}

/** Set-Cookie header value that clears the session cookie. */
export function clearSessionCookie() {
  return sessionCookie("", { maxAgeMs: 0 });
}

/**
 * Express middleware: requires a valid session cookie. Uses the db from
 * `req.app.locals.db` (or `req.db`). Attaches `req.admin = { id, email }`.
 */
export function requireAdmin(req, res, next) {
  const raw = req.headers?.cookie;
  const token = raw ? parseCookie(raw)[COOKIE_NAME] : undefined;
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const db = req.app?.locals?.db ?? req.db;
  if (!db) {
    res.status(500).json({ error: "server_error" });
    return;
  }
  const row = db
    .prepare(
      `SELECT s.id AS session_id, s.expires_at, u.id, u.email
       FROM sessions s JOIN admin_user u ON u.id = s.user_id
       WHERE s.token_hash = ?`,
    )
    .get(hashToken(token));
  if (!row || Date.parse(row.expires_at) <= Date.now()) {
    if (row) db.prepare("DELETE FROM sessions WHERE id = ?").run(row.session_id);
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  req.admin = { id: row.id, email: row.email, sessionId: row.session_id };
  next();
}

/** @returns {string} base32 secret */
export function generateTotpSecret() {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

function totpFor(secret, email = "admin") {
  return new OTPAuth.TOTP({
    issuer: TOTP_ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

/** @returns {string} otpauth:// URL */
export function totpUrl(secret, email) {
  return totpFor(secret, email).toString();
}

/**
 * Accepts the current 30s window ±1 (clock drift).
 * @param {string} secret base32
 * @param {string} token
 */
export function verifyTotp(secret, token) {
  if (!secret || typeof token !== "string" || !/^\d{6}$/.test(token.trim())) {
    return false;
  }
  try {
    return totpFor(secret).validate({ token: token.trim(), window: 1 }) !== null;
  } catch {
    return false;
  }
}

/** Constant-time string compare (utility for callers). */
export function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
