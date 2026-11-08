import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import { Resend } from 'resend';
import { z } from 'zod';
import { buildAckEmail } from './ackEmail.js';
import { createQuotaStore } from './quota.js';

const NODE_ENV = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8787);
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'HAYTHI <contact@mail.haythi.mg>';
const RESEND_TO = process.env.RESEND_TO || 'contact@haythi.mg';
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';
const MIN_SUBMIT_MS = 2500;
const MAX_BODY_BYTES = 16 * 1024;

// Marge sous Resend Free (100/jour, 3000/mois)
const DAILY_SEND_LIMIT = Number(process.env.DAILY_SEND_LIMIT || 80);
const MONTHLY_SEND_LIMIT = Number(process.env.MONTHLY_SEND_LIMIT || 2500);
const EMAIL_COOLDOWN_MS = Number(process.env.EMAIL_COOLDOWN_MS || 60 * 60 * 1000);
const IP_HOUR_MAX = Number(process.env.IP_HOUR_MAX || 10);
const IP_DAY_MAX = Number(process.env.IP_DAY_MAX || 20);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://haythi.mg,https://www.haythi.mg')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (NODE_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://127.0.0.1:5173');
}

const PROTOCOLS = {
  'web-dev': 'Développement Web',
  architecture: 'Architecture SI',
  management: 'Management project',
  consulting: 'Conseil',
  training: 'Formation',
};

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().email().max(160),
  subject: z.enum(['web-dev', 'architecture', 'management', 'consulting', 'training']),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(200).optional().default(''),
  startedAt: z.number().int().positive().optional(),
  turnstileToken: z.string().max(2048).optional().default(''),
  lang: z.enum(['FR', 'EN']).optional().default('FR'),
});

const quota = createQuotaStore({
  filePath: path.join(process.cwd(), 'data', 'quota.json'),
  dailyLimit: DAILY_SEND_LIMIT,
  monthlyLimit: MONTHLY_SEND_LIMIT,
});

function stripControl(value) {
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHeaderSafe(value) {
  return stripControl(value).replace(/[\r\n]/g, '');
}

function jsonError(res, status, code) {
  return res.status(status).json({ ok: false, error: code });
}

function looksLikeSpam(data) {
  const message = data.message || '';
  const name = data.name || '';
  const urls = message.match(/https?:\/\/|www\./gi) || [];
  if (urls.length > 2) return 'TOO_MANY_LINKS';

  // Bots: même contenu répété / caractères random
  if (/(.)\1{9,}/.test(message)) return 'REPEATED_CHARS';
  if (/[\u0400-\u04FF]{20,}/.test(message) && !/[a-zA-ZÀ-ÿ]{3,}/.test(message)) {
    // gros bloc cyrillique seul → souvent spam
    return 'SCRIPT_SPAM';
  }

  const spamWords = /\b(viagra|casino|crypto\s*invest|forex|seo\s*rank|buyer\s*list|nigerian\s*prince)\b/i;
  if (spamWords.test(message) || spamWords.test(name)) return 'KEYWORD_SPAM';

  return null;
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret: TURNSTILE_SECRET,
    response: token,
  });
  if (ip) body.set('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return false;
  const payload = await response.json();
  return Boolean(payload?.success);
}

function originAllowed(req) {
  const origin = req.get('origin');
  if (origin) return ALLOWED_ORIGINS.includes(origin);

  const referer = req.get('referer');
  if (!referer) return NODE_ENV !== 'production';
  try {
    const refOrigin = new URL(referer).origin;
    return ALLOWED_ORIGINS.includes(refOrigin);
  } catch {
    return false;
  }
}

/** Vrai IP client derrière Cloudflare/Apache (pas l'IP edge CF). */
function clientIp(req) {
  const cf = (req.get('cf-connecting-ip') || '').trim();
  if (cf) return cf;
  const real = (req.get('x-real-ip') || '').trim();
  if (real) return real;
  const xff = (req.get('x-forwarded-for') || '').split(',')[0]?.trim();
  if (xff) return xff;
  return req.ip || '';
}

if (!RESEND_API_KEY.startsWith('re_')) {
  console.error('[haythi-api] RESEND_API_KEY manquante ou invalide');
  if (NODE_ENV === 'production') process.exit(1);
}

const resend = RESEND_API_KEY.startsWith('re_') ? new Resend(RESEND_API_KEY) : null;
const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS_DENIED'));
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  }),
);

app.use(
  express.json({
    limit: MAX_BODY_BYTES,
    strict: true,
    type: ['application/json'],
  }),
);

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'RATE_LIMIT' },
  keyGenerator: (req) => clientIp(req) || req.ip || 'unknown',
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true, quota: quota.snapshot() });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    if (!originAllowed(req)) {
      return jsonError(res, 403, 'ORIGIN_DENIED');
    }

    const contentType = req.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return jsonError(res, 415, 'UNSUPPORTED_MEDIA');
    }

    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return jsonError(res, 422, 'INVALID_PAYLOAD');
    }

    const data = parsed.data;

    // Honeypot: bots fill hidden field → fake success (no Resend call = 0 quota).
    if (data.website && data.website.trim() !== '') {
      console.warn('[haythi-api] honeypot trip');
      return res.status(200).json({ ok: true });
    }

    // Timing: submit trop rapide ou timestamp absurde → fake OK, pas d'envoi.
    if (typeof data.startedAt === 'number') {
      const elapsed = Date.now() - data.startedAt;
      if (elapsed < MIN_SUBMIT_MS || elapsed > 1000 * 60 * 60 * 6) {
        console.warn('[haythi-api] timing trap');
        return res.status(200).json({ ok: true });
      }
    } else if (NODE_ENV === 'production') {
      // startedAt obligatoire en prod (anti-script nu)
      console.warn('[haythi-api] missing startedAt');
      return res.status(200).json({ ok: true });
    }

    const spamCode = looksLikeSpam(data);
    if (spamCode) {
      console.warn('[haythi-api] spam filter', spamCode);
      return res.status(200).json({ ok: true });
    }

    const ip = clientIp(req);
    const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstileOk) {
      return jsonError(res, 403, 'CAPTCHA_FAILED');
    }

    const email = escapeHeaderSafe(data.email.toLowerCase());
    // 2 envois Resend : notif interne + accusé utilisateur
    const SEND_UNITS = 2;
    const gate = quota.canSend({
      email,
      ip,
      units: SEND_UNITS,
      emailCooldownMs: EMAIL_COOLDOWN_MS,
      ipHourMax: IP_HOUR_MAX,
      ipDayMax: IP_DAY_MAX,
    });
    if (!gate.ok) {
      console.warn('[haythi-api] quota block', gate.error, 'ip=' + ip);
      // Soft-OK : déjà envoyé / anti double-clic — pas d'erreur UX
      if (
        gate.error === 'EMAIL_COOLDOWN' ||
        gate.error === 'IP_HOUR_LIMIT' ||
        gate.error === 'IP_DAY_LIMIT'
      ) {
        return res.status(200).json({ ok: true, deduped: true });
      }
      return jsonError(res, 429, gate.error);
    }

    if (!resend) {
      return jsonError(res, 500, 'SERVER_CONFIG');
    }

    const name = escapeHeaderSafe(data.name);
    const company = escapeHeaderSafe(data.company || '');
    const message = stripControl(data.message);
    const protocolLabel = PROTOCOLS[data.subject];
    const refId = `haythi-contact-${Date.now()}`;

    const textBody = [
      'IDENTIFIER: ' + name,
      'ORGANIZATION: ' + (company || 'N/A'),
      'COMMS_CHANNEL: ' + email,
      'PROTOCOL_TYPE: ' + protocolLabel,
      'CLIENT_IP: ' + (ip || 'unknown'),
      '',
      'MISSION_DETAILS:',
      message,
    ].join('\n');

    let notifyResult;
    try {
      notifyResult = await resend.emails.send({
        from: RESEND_FROM,
        to: [RESEND_TO],
        replyTo: email,
        subject: `[HAYTHI] ${protocolLabel} - ${name}`.slice(0, 200),
        text: textBody,
        headers: {
          'X-Entity-Ref-ID': refId,
        },
        tags: [{ name: 'source', value: 'contact-form' }],
      });
    } catch (sendErr) {
      console.error('[haythi-api] resend throw', sendErr?.message || sendErr);
      return jsonError(res, 502, 'UPSTREAM_THROW');
    }

    if (notifyResult?.error) {
      console.error('[haythi-api] resend error', JSON.stringify(notifyResult.error));
      return jsonError(res, 502, 'UPSTREAM_REJECTED');
    }

    const ack = buildAckEmail({
      lang: data.lang || 'FR',
      name,
      subjectKey: data.subject,
    });

    let unitsUsed = 1;
    try {
      let ackResult = await resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        replyTo: RESEND_TO,
        subject: ack.subject,
        text: ack.text,
        html: ack.html,
        headers: {
          'X-Entity-Ref-ID': `${refId}-ack`,
        },
        tags: [
          { name: 'source', value: 'contact-ack' },
          { name: 'type', value: 'ack' },
          { name: 'lang', value: data.lang === 'EN' ? 'en' : 'fr' },
        ],
      });
      // Fallback texte si HTML rejeté par Resend
      if (ackResult?.error) {
        console.error('[haythi-api] ack html error', JSON.stringify(ackResult.error));
        ackResult = await resend.emails.send({
          from: RESEND_FROM,
          to: [email],
          replyTo: RESEND_TO,
          subject: ack.subject,
          text: ack.text,
          tags: [
            { name: 'source', value: 'contact-ack' },
            { name: 'type', value: 'ack-text' },
          ],
        });
      }
      if (ackResult?.error) {
        console.error('[haythi-api] ack text error', JSON.stringify(ackResult.error));
      } else {
        unitsUsed = SEND_UNITS;
      }
    } catch (ackErr) {
      console.error('[haythi-api] ack throw', ackErr?.message || ackErr);
    }

    try {
      const usage = quota.recordSend({ email, ip, units: unitsUsed });
      console.log('[haythi-api] sent', usage.dayCount + '/' + usage.dailyLimit, 'day', 'units=' + unitsUsed);
    } catch (quotaErr) {
      console.error('[haythi-api] quota write fail', quotaErr?.message || quotaErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err?.type === 'entity.too.large') {
      return jsonError(res, 413, 'PAYLOAD_TOO_LARGE');
    }
    console.error('[haythi-api] unhandled', err?.stack || err?.message || 'error');
    return jsonError(res, 500, 'INTERNAL');
  }
});

app.use((err, _req, res, _next) => {
  if (err?.message === 'CORS_DENIED') {
    return jsonError(res, 403, 'CORS_DENIED');
  }
  if (err?.type === 'entity.too.large') {
    return jsonError(res, 413, 'PAYLOAD_TOO_LARGE');
  }
  console.error('[haythi-api] middleware', err?.message || 'error');
  return jsonError(res, 500, 'INTERNAL');
});

app.use((_req, res) => jsonError(res, 404, 'NOT_FOUND'));

app.listen(PORT, HOST, () => {
  const q = quota.snapshot();
  console.log(`[haythi-api] listening on ${HOST}:${PORT} (${NODE_ENV})`);
  console.log(`[haythi-api] quota ${q.dayCount}/${q.dailyLimit} day, ${q.monthCount}/${q.monthlyLimit} month`);
});
