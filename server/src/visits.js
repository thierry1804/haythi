import { z } from 'zod';

/** Limite de lignes (day, path, referrer, lang) par jour : borne la cardinalité en cas d'abus. */
const MAX_ROWS_PER_DAY = 5000;

export const VISIT_STATS_DAYS = [7, 30];

export function utcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Incrémente le compteur agrégé (aucune donnée personnelle : ni IP ni user-agent).
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
 * @param {import('better-sqlite3').Database} db
 * @param {number} days  nombre de jours (aujourd'hui inclus, UTC)
 * @param {Date} [now]
 * @returns {{ days: { day: string, hits: number }[], topReferrers: { host: string, hits: number }[] }}
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

  return {
    days: list.map((day) => ({ day, hits: perDay.get(day) ?? 0 })),
    topReferrers,
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
 * @param {{ ownHosts?: string[], isAllowed?: (req) => boolean }} [opts]
 */
export function createBeaconHandler({ ownHosts = [], isAllowed = () => true } = {}) {
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
    try {
      recordVisit(req.app.locals.db, {
        path,
        referrerHost: referrerHostOf(parsed.data.referrer, ownHosts),
        lang: parsed.data.lang ?? '',
      });
    } catch (err) {
      console.error('[haythi-api] visit insert fail', err?.message || err);
    }
    res.status(204).end();
  };
}
