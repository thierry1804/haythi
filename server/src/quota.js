import fs from 'node:fs';
import path from 'node:path';

/**
 * Compteurs persistants pour rester sous les plafonds Resend Free
 * (100/jour, 3000/mois) avec marge de sécurité.
 */
export function createQuotaStore(options = {}) {
  const filePath = options.filePath || path.join(process.cwd(), 'data', 'quota.json');
  const dailyLimit = Number(options.dailyLimit || 80);
  const monthlyLimit = Number(options.monthlyLimit || 2500);

  function todayKey(d = new Date()) {
    return d.toISOString().slice(0, 10); // YYYY-MM-DD UTC
  }

  function monthKey(d = new Date()) {
    return d.toISOString().slice(0, 7); // YYYY-MM UTC
  }

  function emptyState(now = new Date()) {
    return {
      day: todayKey(now),
      month: monthKey(now),
      dayCount: 0,
      monthCount: 0,
      byEmail: {},
      byIp: {},
    };
  }

  function load() {
    try {
      if (!fs.existsSync(filePath)) return emptyState();
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const now = new Date();
      const state = { ...emptyState(now), ...raw };
      if (state.day !== todayKey(now)) {
        state.day = todayKey(now);
        state.dayCount = 0;
        state.byEmail = {};
        state.byIp = {};
      }
      if (state.month !== monthKey(now)) {
        state.month = monthKey(now);
        state.monthCount = 0;
      }
      return state;
    } catch {
      return emptyState();
    }
  }

  function save(state) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const tmp = filePath + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
    fs.renameSync(tmp, filePath);
  }

  function pruneMaps(state, maxAgeMs = 24 * 60 * 60 * 1000) {
    const now = Date.now();
    for (const mapName of ['byEmail', 'byIp']) {
      const map = state[mapName] || {};
      for (const [key, entry] of Object.entries(map)) {
        if (!entry || now - (entry.lastAt || 0) > maxAgeMs) delete map[key];
      }
      state[mapName] = map;
    }
  }

  return {
    dailyLimit,
    monthlyLimit,
    /** @returns {{ ok: true } | { ok: false, error: string }} */
    canSend({ email, ip, emailCooldownMs = 60 * 60 * 1000, ipHourMax = 3, ipDayMax = 8 }) {
      const state = load();
      pruneMaps(state);

      if (state.dayCount >= dailyLimit) {
        return { ok: false, error: 'DAILY_QUOTA' };
      }
      if (state.monthCount >= monthlyLimit) {
        return { ok: false, error: 'MONTHLY_QUOTA' };
      }

      const emailKey = (email || '').toLowerCase();
      if (emailKey) {
        const prev = state.byEmail[emailKey];
        if (prev && Date.now() - prev.lastAt < emailCooldownMs) {
          return { ok: false, error: 'EMAIL_COOLDOWN' };
        }
      }

      if (ip) {
        const prev = state.byIp[ip] || { hourAt: 0, hourCount: 0, dayCount: 0, lastAt: 0 };
        const hourStart = Date.now() - 60 * 60 * 1000;
        const hourCount = prev.lastAt >= hourStart ? prev.hourCount : 0;
        if (hourCount >= ipHourMax) return { ok: false, error: 'IP_HOUR_LIMIT' };
        if ((prev.dayCount || 0) >= ipDayMax) return { ok: false, error: 'IP_DAY_LIMIT' };
      }

      return { ok: true };
    },
    recordSend({ email, ip }) {
      const state = load();
      pruneMaps(state);
      state.dayCount += 1;
      state.monthCount += 1;

      const emailKey = (email || '').toLowerCase();
      if (emailKey) {
        state.byEmail[emailKey] = {
          lastAt: Date.now(),
          count: (state.byEmail[emailKey]?.count || 0) + 1,
        };
      }

      if (ip) {
        const prev = state.byIp[ip] || { hourAt: Date.now(), hourCount: 0, dayCount: 0, lastAt: 0 };
        const hourStart = Date.now() - 60 * 60 * 1000;
        const hourCount = prev.lastAt >= hourStart ? prev.hourCount + 1 : 1;
        state.byIp[ip] = {
          hourAt: hourCount === 1 ? Date.now() : prev.hourAt,
          hourCount,
          dayCount: (prev.dayCount || 0) + 1,
          lastAt: Date.now(),
        };
      }

      save(state);
      return {
        dayCount: state.dayCount,
        monthCount: state.monthCount,
        dailyLimit,
        monthlyLimit,
      };
    },
    snapshot() {
      const state = load();
      return {
        day: state.day,
        month: state.month,
        dayCount: state.dayCount,
        monthCount: state.monthCount,
        dailyLimit,
        monthlyLimit,
      };
    },
  };
}
