import { z } from 'zod';

/** Limite de lignes (day, path, referrer, lang) par jour : borne la cardinalité en cas d'abus. */
const MAX_ROWS_PER_DAY = 5000;

/** Journal individuel : 30 jours, plafond de lignes. */
export const VISIT_LOG_DAYS = 30;
export const VISIT_LOG_MAX = 10000;

export const VISIT_STATS_DAYS = [7, 30];

export function utcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Incrémente le compteur journalier (page, referrer, langue).
 * L'IP et le pays sont dans visit_hits, pas ici.
 * @param {import('better-sqlite3').Database} db
 * @param {{ path: string, referrerHost?: string, lang?: string, day?: string }} visit
 * @returns {boolean} false si ignoré (plafond de lignes du jour atteint)
 */
export function recordVisit(
  db,
  { path, referrerHost = '', lang = '', day = utcDay() },
  { maxRowsPerDay = MAX_ROWS_PER_DAY } = {},
) {
  const key = [day, path, referrerHost, lang];
  const exists = db
    .prepare(
      'SELECT 1 FROM visits_daily WHERE day = ? AND path = ? AND referrer_host = ? AND lang = ?',
    )
    .get(...key);
  if (!exists) {
    const { n } = db.prepare('SELECT COUNT(*) AS n FROM visits_daily WHERE day = ?').get(day);
    if (n >= maxRowsPerDay) return false;
  }
  db.prepare(
    `INSERT INTO visits_daily (day, path, referrer_host, lang, hits) VALUES (?, ?, ?, ?, 1)
     ON CONFLICT (day, path, referrer_host, lang) DO UPDATE SET hits = hits + 1`,
  ).run(...key);
  return true;
}

/**
 * Ligne de visite (IP, pays, navigateur). Purge au-delà de 30 jours et du plafond.
 * @param {import('better-sqlite3').Database} db
 * @param {{ ip?: string, country?: string, path: string, referrerHost?: string, lang?: string, userAgent?: string, at?: Date }} hit
 */
export function recordVisitHit(
  db,
  { ip = '', country = '', path, referrerHost = '', lang = '', userAgent = '', at = new Date() },
) {
  db.prepare(
    `INSERT INTO visit_hits (created_at, ip, country, path, referrer_host, lang, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(at.toISOString(), ip, country, path, referrerHost, lang, userAgent);

  const cutoff = new Date(at.getTime() - VISIT_LOG_DAYS * 86_400_000).toISOString();
  db.prepare('DELETE FROM visit_hits WHERE created_at < ?').run(cutoff);
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM visit_hits').get();
  if (n > VISIT_LOG_MAX) {
    db.prepare(
      `DELETE FROM visit_hits WHERE id IN (
         SELECT id FROM visit_hits ORDER BY id ASC LIMIT ?
       )`,
    ).run(n - VISIT_LOG_MAX);
  }
}

/** IP client derrière Cloudflare ou le reverse proxy. Tronquée. */
export function clientIpFrom(req) {
  const cf = (req.get('cf-connecting-ip') || '').trim();
  if (cf) return cf.slice(0, 64);
  const real = (req.get('x-real-ip') || '').trim();
  if (real) return real.slice(0, 64);
  const xff = (req.get('x-forwarded-for') || '').split(',')[0]?.trim();
  if (xff) return xff.slice(0, 64);
  return String(req.ip || '').slice(0, 64);
}

/** Code pays Cloudflare (CF-IPCountry). '' si absent ou inconnu (XX). T1 = Tor. */
export function countryCodeOf(value) {
  const raw = String(value || '').trim().toUpperCase();
  if (raw === 'T1') return 'T1';
  if (!/^[A-Z]{2}$/.test(raw) || raw === 'XX') return '';
  return raw;
}

/** User-Agent sans caractères de contrôle, 200 caractères max. */
export function clipUserAgent(value) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, 200);
}

/**
 * @param {import('better-sqlite3').Database} db
 * @param {number} days  nombre de jours (aujourd'hui inclus, UTC)
 * @param {Date} [now]
 * @returns {{
 *   days: { day: string, hits: number }[],
 *   topReferrers: { host: string, hits: number }[],
 *   directHits: number,
 *   topPaths: { path: string, hits: number }[],
 *   langs: { lang: string, hits: number }[],
 *   countries: { code: string, hits: number }[],
 *   recent: { id: number, created_at: string, ip: string, country: string, path: string, referrer_host: string, lang: string, user_agent: string }[],
 * }}
 */
export function getVisitStats(db, days, now = new Date()) {
  const n = Math.max(1, Math.floor(days));
  const list = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    list.push(utcDay(new Date(now.getTime() - i * 86_400_000)));
  }
  const since = list[0];

  const perDay = new Map(
    db
      .prepare('SELECT day, SUM(hits) AS hits FROM visits_daily WHERE day >= ? GROUP BY day')
      .all(since)
      .map((r) => [r.day, r.hits]),
  );
  const topReferrers = db
    .prepare(
      `SELECT referrer_host AS host, SUM(hits) AS hits FROM visits_daily
       WHERE day >= ? AND referrer_host <> ''
       GROUP BY referrer_host ORDER BY hits DESC, host ASC LIMIT 10`,
    )
    .all(since);

  const topPaths = db
    .prepare(
      `SELECT path, SUM(hits) AS hits FROM visits_daily
       WHERE day >= ?
       GROUP BY path ORDER BY hits DESC, path ASC LIMIT 10`,
    )
    .all(since);

  const langs = db
    .prepare(
      `SELECT lang, SUM(hits) AS hits FROM visits_daily
       WHERE day >= ?
       GROUP BY lang ORDER BY hits DESC, lang ASC`,
    )
    .all(since);

  const direct = db
    .prepare(
      `SELECT COALESCE(SUM(hits), 0) AS hits FROM visits_daily
       WHERE day >= ? AND referrer_host = ''`,
    )
    .get(since);

  const sinceIso = `${since}T00:00:00.000Z`;
  const countries = db
    .prepare(
      `SELECT country AS code, COUNT(*) AS hits FROM visit_hits
       WHERE created_at >= ?
       GROUP BY country ORDER BY hits DESC, code ASC LIMIT 20`,
    )
    .all(sinceIso);
  const recent = db
    .prepare(
      `SELECT id, created_at, ip, country, path, referrer_host, lang, user_agent
       FROM visit_hits WHERE created_at >= ?
       ORDER BY created_at DESC LIMIT 100`,
    )
    .all(sinceIso);

  return {
    days: list.map((day) => ({ day, hits: perDay.get(day) ?? 0 })),
    topReferrers,
    directHits: direct.hits,
    topPaths,
    langs,
    countries,
    recent,
  };
}

export const beaconSchema = z.object({
  path: z.string().max(200),
  referrer: z.string().max(500).optional(),
  lang: z.enum(['FR', 'EN']).optional(),
});

/** Chemin sans query/hash ; null si invalide. */
export function normalizePath(raw) {
  const p = raw.split(/[?#]/)[0];
  // eslint-disable-next-line no-control-regex
  if (!p.startsWith('/') || /[\u0000-\u001F\u007F\s]/.test(p)) return null;
  return p;
}

/** Hôte du referrer (http/https uniquement), '' si absent, invalide ou interne. */
export function referrerHostOf(referrer, ownHosts = []) {
  if (!referrer) return '';
  try {
    const url = new URL(referrer);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    const host = url.hostname.toLowerCase();
    return ownHosts.includes(host) ? '' : host;
  } catch {
    return '';
  }
}

/**
 * Handler Express de POST /api/t. Répond 204 sans corps ; 422 si payload invalide.
 * @param {{ ownHosts?: string[], isAllowed?: (req) => boolean, clientIp?: (req) => string }} [opts]
 */
export function createBeaconHandler({
  ownHosts = [],
  isAllowed = () => true,
  clientIp = clientIpFrom,
} = {}) {
  return (req, res) => {
    if (!isAllowed(req)) {
      res.status(403).json({ ok: false, error: 'ORIGIN_DENIED' });
      return;
    }
    const parsed = beaconSchema.safeParse(req.body);
    const path = parsed.success ? normalizePath(parsed.data.path) : null;
    if (!parsed.success || !path) {
      res.status(422).json({ ok: false, error: 'INVALID_PAYLOAD' });
      return;
    }
    const referrerHost = referrerHostOf(parsed.data.referrer, ownHosts);
    const lang = parsed.data.lang ?? '';
    try {
      const visitDb = req.app.locals.db;
      recordVisit(visitDb, { path, referrerHost, lang });
      recordVisitHit(visitDb, {
        ip: clientIp(req),
        country: countryCodeOf(req.get('cf-ipcountry')),
        path,
        referrerHost,
        lang,
        userAgent: clipUserAgent(req.get('user-agent')),
      });
    } catch (err) {
      console.error('[haythi-api] visit insert fail', err?.message || err);
    }
    res.status(204).end();
  };
}
