import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import express from "express";

import * as auth from "../src/auth.js";
import { createAdminRouter } from "../src/adminRoutes.js";
import { openDb } from "../src/db.js";
import {
  countryCodeOf,
  createBeaconHandler,
  getVisitStats,
  recordVisit,
  recordVisitHit,
} from "../src/visits.js";

const CSRF = "csrf-token-for-tests";

let tempDir;
let db;
let prevSecret;
let server;
let base;
let sessionToken;

function listen(app) {
  return new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
}

const hitsFor = (day, path) =>
  db
    .prepare("SELECT COALESCE(SUM(hits), 0) AS n FROM visits_daily WHERE day = ? AND path = ?")
    .get(day, path).n;

function beacon(body, headers = {}) {
  return fetch(`${base}/api/t`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

before(async () => {
  prevSecret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "test-secret";
  tempDir = await mkdtemp(join(tmpdir(), "haythi-visits-test-"));
  db = openDb(join(tempDir, "test.sqlite"));
  db.prepare(
    "INSERT INTO admin_user (id, email, password_hash, totp_secret, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run("u1", "admin@haythi.mg", await auth.hashPassword("pw"), auth.generateTotpSecret(), new Date().toISOString());
  sessionToken = auth.createSession(db, "u1");

  const app = express();
  app.locals.db = db;
  app.use(express.json());
  app.post("/api/t", createBeaconHandler({ ownHosts: ["haythi.mg"] }));
  app.use(
    "/api/admin",
    createAdminRouter({ resend: null, resendFrom: "x", resendTo: "y" }),
  );
  server = await listen(app);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((r) => server.close(r));
  if (prevSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = prevSecret;
  db.close();
  await rm(tempDir, { recursive: true, force: true });
});

test("recordVisit increments hits", () => {
  const visit = { path: "/a", referrerHost: "google.com", lang: "FR", day: "2026-01-01" };
  recordVisit(db, visit);
  recordVisit(db, visit);
  recordVisit(db, { ...visit, lang: "EN" });
  assert.equal(hitsFor("2026-01-01", "/a"), 3);
  const row = db
    .prepare("SELECT hits FROM visits_daily WHERE day = ? AND path = ? AND lang = 'FR'")
    .get("2026-01-01", "/a");
  assert.equal(row.hits, 2);
});

test("recordVisit caps distinct rows per day", () => {
  const day = "2026-02-02";
  assert.equal(recordVisit(db, { path: "/x1", day }, { maxRowsPerDay: 2 }), true);
  assert.equal(recordVisit(db, { path: "/x2", day }, { maxRowsPerDay: 2 }), true);
  assert.equal(recordVisit(db, { path: "/x3", day }, { maxRowsPerDay: 2 }), false);
  // une ligne existante continue d'être incrémentée
  assert.equal(recordVisit(db, { path: "/x1", day }, { maxRowsPerDay: 2 }), true);
  assert.equal(hitsFor(day, "/x1"), 2);
  assert.equal(hitsFor(day, "/x3"), 0);
});

test("getVisitStats zero-fills days and ranks referrers", () => {
  const now = new Date("2026-03-10T12:00:00Z");
  recordVisit(db, { path: "/", referrerHost: "google.com", lang: "FR", day: "2026-03-10" });
  recordVisit(db, { path: "/", referrerHost: "google.com", lang: "FR", day: "2026-03-09" });
  recordVisit(db, { path: "/b", referrerHost: "bing.com", lang: "FR", day: "2026-03-09" });
  recordVisit(db, { path: "/", referrerHost: "", lang: "FR", day: "2026-03-08" });
  recordVisit(db, { path: "/", referrerHost: "old.example", lang: "FR", day: "2026-02-01" });

  const stats = getVisitStats(db, 7, now);
  assert.equal(stats.days.length, 7);
  assert.deepEqual(stats.days[0], { day: "2026-03-04", hits: 0 });
  assert.deepEqual(stats.days[6], { day: "2026-03-10", hits: 1 });
  assert.equal(stats.days.find((d) => d.day === "2026-03-09").hits, 2);
  assert.deepEqual(stats.topReferrers, [
    { host: "google.com", hits: 2 },
    { host: "bing.com", hits: 1 },
  ]);
  assert.equal(stats.directHits, 1);
  assert.deepEqual(stats.topPaths, [
    { path: "/", hits: 3 },
    { path: "/b", hits: 1 },
  ]);
  assert.deepEqual(stats.langs, [{ lang: "FR", hits: 4 }]);
  assert.deepEqual(stats.countries, []);
  assert.deepEqual(stats.recent, []);
});

test("countryCodeOf keeps ISO codes and drops unknown", () => {
  assert.equal(countryCodeOf("mg"), "MG");
  assert.equal(countryCodeOf("T1"), "T1");
  assert.equal(countryCodeOf("XX"), "");
  assert.equal(countryCodeOf("France"), "");
  assert.equal(countryCodeOf(""), "");
});

test("recordVisitHit stores ip and country and drops rows older than 30 days", () => {
  const now = new Date("2026-04-01T12:00:00.000Z");
  recordVisitHit(db, {
    ip: "1.1.1.1",
    country: "FR",
    path: "/old-hit",
    at: new Date("2026-02-01T00:00:00.000Z"),
  });
  recordVisitHit(db, {
    ip: "41.188.1.2",
    country: "MG",
    path: "/now-hit",
    lang: "FR",
    userAgent: "Mozilla/5.0",
    at: now,
  });
  assert.equal(db.prepare("SELECT 1 FROM visit_hits WHERE path = '/old-hit'").get(), undefined);
  const row = db.prepare("SELECT ip, country, lang FROM visit_hits WHERE path = '/now-hit'").get();
  assert.deepEqual(row, { ip: "41.188.1.2", country: "MG", lang: "FR" });
  const stats = getVisitStats(db, 7, now);
  assert.deepEqual(stats.countries, [{ code: "MG", hits: 1 }]);
  assert.equal(stats.recent[0].ip, "41.188.1.2");
  assert.equal(stats.recent[0].path, "/now-hit");
});

test("POST /api/t records a visit (path normalized, referrer reduced to host)", async () => {
  const day = new Date().toISOString().slice(0, 10);
  const before = hitsFor(day, "/services");
  const res = await beacon({
    path: "/services?utm=1#top",
    referrer: "https://www.google.com/search?q=secret",
    lang: "EN",
  });
  assert.equal(res.status, 204);
  assert.equal(hitsFor(day, "/services"), before + 1);
  const row = db
    .prepare("SELECT referrer_host, lang FROM visits_daily WHERE day = ? AND path = '/services'")
    .get(day);
  assert.equal(row.referrer_host, "www.google.com");
  assert.equal(row.lang, "EN");
});

test("POST /api/t stores ip, country and user-agent", async () => {
  const res = await beacon(
    { path: "/geo", lang: "FR" },
    {
      "cf-connecting-ip": "2001:db8::20",
      "cf-ipcountry": "MG",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0",
    },
  );
  assert.equal(res.status, 204);
  const row = db
    .prepare("SELECT ip, country, user_agent FROM visit_hits WHERE path = '/geo'")
    .get();
  assert.equal(row.ip, "2001:db8::20");
  assert.equal(row.country, "MG");
  assert.match(row.user_agent, /Chrome\/120/);
});

test("POST /api/t ignores internal referrer", async () => {
  const day = new Date().toISOString().slice(0, 10);
  await beacon({ path: "/int", referrer: "https://haythi.mg/" });
  const row = db.prepare("SELECT referrer_host FROM visits_daily WHERE day = ? AND path = '/int'").get(day);
  assert.equal(row.referrer_host, "");
});

test("POST /api/t rejects path longer than 200", async () => {
  const res = await beacon({ path: "/" + "a".repeat(200) });
  assert.equal(res.status, 422);
  const ok = await beacon({ path: "/" + "a".repeat(199) });
  assert.equal(ok.status, 204);
});

test("POST /api/t rejects invalid payloads", async () => {
  for (const body of [{}, { path: "nope" }, { path: "/a b" }, { path: "/a", lang: "DE" }, { path: 5 }]) {
    const res = await beacon(body);
    assert.equal(res.status, 422, JSON.stringify(body));
  }
});

test("stats requires admin", async () => {
  const anon = await fetch(`${base}/api/admin/stats/visits`);
  assert.equal(anon.status, 401);

  const res = await fetch(`${base}/api/admin/stats/visits?days=30`, {
    headers: {
      cookie: `${auth.COOKIE_NAME}=${sessionToken}; haythi_csrf=${CSRF}`,
      "x-csrf-token": CSRF,
    },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.days.length, 30);
  assert.ok(Array.isArray(body.topReferrers));
});

test("stats rejects days other than 7 or 30", async () => {
  const res = await fetch(`${base}/api/admin/stats/visits?days=5`, {
    headers: {
      cookie: `${auth.COOKIE_NAME}=${sessionToken}; haythi_csrf=${CSRF}`,
      "x-csrf-token": CSRF,
    },
  });
  assert.equal(res.status, 400);
});
