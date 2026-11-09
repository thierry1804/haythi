import { parse as parseCookie, serialize as serializeCookie } from "cookie";
import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import {
  clearSessionCookie,
  COOKIE_NAME,
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  safeEqual,
  sessionCookie,
  sessionCookieOptions,
  verifyPassword,
  verifyTotp,
} from "./auth.js";
import { randomBytes } from "node:crypto";
import {
  addEvent,
  anonymizeLead,
  countLeads,
  deleteLead,
  exportLead,
  getLead,
  isAnonymized,
  LEAD_STATUSES,
  listEvents,
  listLeads,
  updateStatus,
} from "./leads.js";
import { buildReplyEmail } from "./ackEmail.js";
import { replySubject } from "./protocols.js";
import { getVisitStats, VISIT_STATS_DAYS } from "./visits.js";

export const CSRF_COOKIE = "haythi_csrf";
export const CSRF_HEADER = "x-csrf-token";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const TOTP_REPLAY_TTL_MS = 2 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().trim().min(1).max(160),
  password: z.string().min(1).max(256),
  totp: z.string().max(16).optional().default(""),
});

const statusSchema = z.object({ status: z.enum(LEAD_STATUSES) });

const replySchema = z.object({
  subject: z.string().max(300),
  text: z.string().max(10_000),
});

function stripControl(value) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

function newCsrfToken() {
  return randomBytes(24).toString("base64url");
}

function csrfCookie(token) {
  return serializeCookie(CSRF_COOKIE, token, { ...sessionCookieOptions(), httpOnly: false });
}

function clearCsrfCookie() {
  return serializeCookie(CSRF_COOKIE, "", {
    ...sessionCookieOptions({ maxAgeMs: 0 }),
    httpOnly: false,
  });
}

/** Double-submit cookie : header X-CSRF-Token == cookie haythi_csrf sur PATCH/POST/DELETE. */
export function requireCsrf(req, res, next) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    next();
    return;
  }
  const raw = req.headers?.cookie;
  const cookieToken = raw ? parseCookie(raw)[CSRF_COOKIE] : undefined;
  const headerToken = req.get ? req.get(CSRF_HEADER) : req.headers?.[CSRF_HEADER];
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    res.status(403).json({ error: "csrf" });
    return;
  }
  next();
}

/**
 * Anti-rejeu TOTP : un code accepté ne peut pas resservir dans sa fenêtre de validité.
 * (en mémoire : suffisant pour une instance unique)
 */
function createTotpReplayGuard() {
  const used = new Map();
  return {
    /** @returns {boolean} false si déjà utilisé */
    consume(userId, token) {
      const now = Date.now();
      for (const [k, exp] of used) if (exp <= now) used.delete(k);
      const key = `${userId}:${token}`;
      if (used.has(key)) return false;
      used.set(key, now + TOTP_REPLAY_TTL_MS);
      return true;
    },
  };
}

/**
 * @param {object} opts
 * @param {{ emails: { send: Function } } | null} opts.resend
 * @param {string} opts.resendFrom
 * @param {string} opts.resendTo  adresse interne (Cc + Reply-To des réponses)
 * @param {number} [opts.loginMax] échecs de login autorisés par IP / 15 min
 * @param {(req: import('express').Request) => string} [opts.clientIp]
 */
export function createAdminRouter({
  resend,
  resendFrom,
  resendTo,
  loginMax = 10,
  clientIp = (req) => req.ip || "unknown",
}) {
  const router = express.Router();
  const replayGuard = createTotpReplayGuard();
  let dummyHash;

  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  const tooMany = { error: "rate_limit" };
  // Seuls les échecs comptent (skipSuccessfulRequests), par IP puis par compte.
  const ipLimiter = rateLimit({
    windowMs: LOGIN_WINDOW_MS,
    max: loginMax,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: tooMany,
    keyGenerator: (req) => clientIp(req),
  });
  const accountLimiter = rateLimit({
    windowMs: LOGIN_WINDOW_MS,
    max: loginMax * 2,
    skipSuccessfulRequests: true,
    standardHeaders: false,
    legacyHeaders: false,
    message: tooMany,
    keyGenerator: (req) => `acct:${String(req.body?.email ?? "").trim().toLowerCase().slice(0, 160)}`,
  });

  router.post("/login", ipLimiter, accountLimiter, async (req, res, next) => {
    try {
      await handleLogin(req, res);
    } catch (err) {
      next(err);
    }
  });

  async function handleLogin(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "invalid_payload" });
      return;
    }
    const { email, password, totp } = parsed.data;
    const db = req.app.locals.db;
    const user = db
      .prepare("SELECT id, email, password_hash, totp_secret FROM admin_user WHERE lower(email) = ?")
      .get(email.toLowerCase());

    // Temps de réponse comparable que l'utilisateur existe ou non.
    dummyHash ??= await hashPassword("haythi-dummy-password");
    const passwordOk = await verifyPassword(user ? user.password_hash : dummyHash, password);

    // TOTP obligatoire : pas de secret configuré => login refusé (fail closed).
    const totpOk =
      passwordOk &&
      Boolean(user?.totp_secret) &&
      verifyTotp(user.totp_secret, totp) &&
      replayGuard.consume(user.id, totp.trim());

    if (!user || !passwordOk || !totpOk) {
      res.status(401).json({ error: "invalid_credentials" });
      return;
    }

    const token = createSession(db, user.id);
    res.append("Set-Cookie", sessionCookie(token));
    res.append("Set-Cookie", csrfCookie(newCsrfToken()));
    res.json({ ok: true });
  }

  // Tout le reste : session valide + CSRF sur les méthodes mutantes.
  router.use(requireAdmin, requireCsrf);

  router.post("/logout", (req, res) => {
    const token = parseCookie(req.headers.cookie ?? "")[COOKIE_NAME];
    if (token) destroySession(req.app.locals.db, token);
    res.append("Set-Cookie", clearSessionCookie());
    res.append("Set-Cookie", clearCsrfCookie());
    res.json({ ok: true });
  });

  router.get("/me", (req, res) => {
    // Réémet le cookie CSRF s'il a disparu (session encore valide).
    if (!parseCookie(req.headers.cookie ?? "")[CSRF_COOKIE]) {
      res.append("Set-Cookie", csrfCookie(newCsrfToken()));
    }
    res.json({ email: req.admin.email });
  });

  router.get("/stats/visits", (req, res) => {
    const days = req.query.days === undefined ? 7 : Number(req.query.days);
    if (!VISIT_STATS_DAYS.includes(days)) {
      res.status(400).json({ error: "invalid_days" });
      return;
    }
    res.json(getVisitStats(req.app.locals.db, days));
  });

  router.get("/leads", (req, res) => {
    const { status } = req.query;
    if (status !== undefined && !LEAD_STATUSES.includes(status)) {
      res.status(400).json({ error: "invalid_status" });
      return;
    }
    const db = req.app.locals.db;
    res.json({ leads: listLeads(db, { status }), total: countLeads(db, { status }) });
  });

  /** Charge le lead :id ou répond 404. */
  function withLead(handler) {
    return async (req, res, next) => {
      try {
        const db = req.app.locals.db;
        const lead = getLead(db, req.params.id);
        if (!lead) {
          res.status(404).json({ error: "not_found" });
          return;
        }
        await handler(req, res, db, lead);
      } catch (err) {
        next(err);
      }
    };
  }

  router.get(
    "/leads/:id",
    withLead((_req, res, db, lead) => {
      res.json({ lead, events: listEvents(db, lead.id) });
    }),
  );

  router.patch(
    "/leads/:id",
    withLead((req, res, db, lead) => {
      const parsed = statusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_status" });
        return;
      }
      updateStatus(db, lead.id, parsed.data.status);
      res.json({ lead: getLead(db, lead.id) });
    }),
  );

  router.post(
    "/leads/:id/reply",
    withLead(async (req, res, db, lead) => {
      const parsed = replySchema.safeParse(req.body);
      const rawSubject = parsed.success ? stripControl(parsed.data.subject) : "";
      const text = parsed.success ? parsed.data.text.trim() : "";
      if (!parsed.success || !rawSubject || !text) {
        res.status(400).json({ error: "invalid_payload" });
        return;
      }
      const subject = replySubject(rawSubject, lead.subject);
      if (isAnonymized(lead)) {
        res.status(409).json({ error: "anonymized" });
        return;
      }
      if (!resend) {
        res.status(500).json({ error: "server_config" });
        return;
      }

      const mail = buildReplyEmail({
        lang: lead.lang === "EN" ? "EN" : "FR",
        name: lead.name || "",
        subject: subject.slice(0, 200),
        text,
        subjectKey: lead.subject || "",
      });

      let result;
      try {
        result = await resend.emails.send({
          from: resendFrom,
          to: [lead.email],
          cc: [resendTo],
          replyTo: resendTo,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          tags: [{ name: "source", value: "admin-reply" }],
        });
      } catch (err) {
        console.error("[haythi-api] reply throw", err?.message || err);
        res.status(502).json({ error: "upstream_throw" });
        return;
      }
      if (result?.error) {
        console.error("[haythi-api] reply error", JSON.stringify(result.error));
        res.status(502).json({ error: "upstream_rejected" });
        return;
      }

      db.transaction(() => {
        addEvent(db, lead.id, "reply", {
          subject: subject.slice(0, 200),
          text,
          by: req.admin.email,
          resend_id: result?.data?.id ?? null,
        });
        if (lead.status === "new" || lead.status === "in_progress") {
          updateStatus(db, lead.id, "replied");
        }
      })();
      res.json({ ok: true });
    }),
  );

  router.get(
    "/leads/:id/export",
    withLead((_req, res, db, lead) => {
      const payload = exportLead(db, lead.id);
      res.set("Content-Type", "application/json; charset=utf-8");
      res.set("Content-Disposition", `attachment; filename="lead-${lead.id}.json"`);
      res.send(JSON.stringify(payload, null, 2));
    }),
  );

  router.post(
    "/leads/:id/anonymize",
    withLead((req, res, db, lead) => {
      anonymizeLead(db, lead.id);
      console.log("[haythi-api] lead anonymized", lead.id, "by", req.admin.email);
      res.json({ ok: true });
    }),
  );

  router.delete(
    "/leads/:id",
    withLead((req, res, db, lead) => {
      deleteLead(db, lead.id);
      console.log("[haythi-api] lead deleted", lead.id, "by", req.admin.email);
      res.json({ ok: true });
    }),
  );

  return router;
}
