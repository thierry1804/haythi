import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import express from "express";
import * as OTPAuth from "otpauth";

import * as auth from "../src/auth.js";
import { openDb } from "../src/db.js";
import { createAdminRouter } from "../src/adminRoutes.js";
import { createLead, getLead } from "../src/leads.js";

const EMAIL = "admin@haythi.mg";
const PASSWORD = "correct horse battery";
const CSRF = "csrf-token-for-tests";

let tempDir;
let db;
let prevSecret;
let totpSecret;
let sent;
let sendImpl;
let server;
let base;
let sessionToken;

const resend = {
  emails: {
    send: (payload) => {
      sent.push(payload);
      return sendImpl(payload);
    },
  },
};

function totpCode(offsetWindows = 0) {
  return new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(totpSecret),
  }).generate({ timestamp: Date.now() + offsetWindows * 30_000 });
}

function listen(app) {
  return new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
}

function buildApp(opts = {}) {
  const app = express();
  app.locals.db = db;
  app.use(express.json());
  app.use(
    "/api/admin",
    createAdminRouter({
      resend,
      resendFrom: "HAYTHI <contact@mail.haythi.mg>",
      resendTo: "contact@haythi.mg",
      ...opts,
    }),
  );
  return app;
}

/** fetch avec session + CSRF (double-submit) par défaut. */
function api(path, { method = "GET", body, session = true, csrf = true, headers = {} } = {}) {
  const cookies = [];
  if (session) cookies.push(`${auth.COOKIE_NAME}=${sessionToken}`);
  if (csrf) cookies.push(`haythi_csrf=${CSRF}`);
  const h = {};
  if (cookies.length) h.cookie = cookies.join("; ");
  if (csrf) h["x-csrf-token"] = CSRF;
  Object.assign(h, headers);
  if (body !== undefined) h["content-type"] = "application/json";
  return fetch(`${base}/api/admin${path}`, {
    method,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function makeLead(over = {}) {
  const { id } = createLead(db, {
    name: "Jean Rakoto",
    company: "Acme",
    email: "jean@example.com",
    subject: "web-dev",
    message: "Bonjour, je souhaite un site vitrine.",
    lang: "FR",
    ...over,
  });
  return id;
}

before(async () => {
  prevSecret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "test-secret";
  tempDir = await mkdtemp(join(tmpdir(), "haythi-admin-test-"));
  db = openDb(join(tempDir, "test.sqlite"));
  totpSecret = auth.generateTotpSecret();
  db.prepare(
    "INSERT INTO admin_user (id, email, password_hash, totp_secret, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run("u1", EMAIL, await auth.hashPassword(PASSWORD), totpSecret, new Date().toISOString());
  sessionToken = auth.createSession(db, "u1");
  server = await listen(buildApp());
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((r) => server.close(r));
  if (prevSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = prevSecret;
  db.close();
  await rm(tempDir, { recursive: true, force: true });
});

test("GET leads without session → 401", async () => {
  const res = await api("/leads", { session: false });
  assert.equal(res.status, 401);
});

test("GET leads lists and filters by status", async () => {
  const a = makeLead({ email: "a@example.com" });
  const b = makeLead({ email: "b@example.com" });
  db.prepare("UPDATE leads SET status = 'closed' WHERE id = ?").run(b);

  const all = await (await api("/leads")).json();
  const ids = all.leads.map((l) => l.id);
  assert.ok(ids.includes(a) && ids.includes(b));

  const closed = await (await api("/leads?status=closed")).json();
  assert.ok(closed.leads.every((l) => l.status === "closed"));
  assert.ok(closed.leads.some((l) => l.id === b));
  assert.equal(closed.total, closed.leads.length);
  assert.ok(all.total >= all.leads.length);
  assert.ok(!closed.leads.some((l) => l.id === a));

  const bad = await api("/leads?status=bogus");
  assert.equal(bad.status, 400);
});

test("GET lead by id returns lead and events; 404 when unknown", async () => {
  const id = makeLead();
  const res = await api(`/leads/${id}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.lead.email, "jean@example.com");
  assert.deepEqual(body.events, []);
  assert.equal((await api("/leads/nope")).status, 404);
});

test("mutations require CSRF header matching haythi_csrf cookie", async () => {
  const id = makeLead();
  const missing = await api(`/leads/${id}`, {
    method: "PATCH",
    body: { status: "closed" },
    csrf: false,
  });
  assert.equal(missing.status, 403);

  const mismatch = await api(`/leads/${id}`, {
    method: "PATCH",
    body: { status: "closed" },
    headers: { "x-csrf-token": "other" },
  });
  assert.equal(mismatch.status, 403);
  assert.equal(getLead(db, id).status, "new");
});

test("PATCH updates status and records event; rejects invalid status", async () => {
  const id = makeLead();
  const res = await api(`/leads/${id}`, { method: "PATCH", body: { status: "in_progress" } });
  assert.equal(res.status, 200);
  assert.equal(getLead(db, id).status, "in_progress");
  const events = db.prepare("SELECT * FROM lead_events WHERE lead_id = ?").all(id);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "status");
  assert.deepEqual(JSON.parse(events[0].payload_json), { from: "new", to: "in_progress" });

  const bad = await api(`/leads/${id}`, { method: "PATCH", body: { status: "nope" } });
  assert.equal(bad.status, 400);
  assert.equal(getLead(db, id).status, "in_progress");

  const unknown = await api("/leads/missing", { method: "PATCH", body: { status: "spam" } });
  assert.equal(unknown.status, 404);
});

test("reply sends via Resend (To lead, From RESEND_FROM, Reply-To + Cc) and stores event", async () => {
  const id = makeLead({ email: "prospect@example.com" });
  sent = [];
  sendImpl = async () => ({ data: { id: "em_1" }, error: null });

  const res = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "Re: votre projet", text: "Bonjour,\nMerci pour votre message." },
  });
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].to, ["prospect@example.com"]);
  assert.equal(sent[0].from, "HAYTHI <contact@mail.haythi.mg>");
  assert.equal(sent[0].replyTo, "contact@haythi.mg");
  assert.deepEqual(sent[0].cc, ["contact@haythi.mg"]);
  assert.equal(sent[0].subject, "Re: votre projet");
  assert.match(sent[0].text, /Merci pour votre message/);
  assert.match(sent[0].html, /Merci pour votre message/);
  assert.match(sent[0].html, /<br>/);

  const events = db
    .prepare("SELECT * FROM lead_events WHERE lead_id = ? AND type = 'reply'")
    .all(id);
  assert.equal(events.length, 1);
  const payload = JSON.parse(events[0].payload_json);
  assert.equal(payload.subject, "Re: votre projet");
  assert.match(payload.text, /Merci/);
  assert.equal(getLead(db, id).status, "replied");
});

test("reply: raw subject key becomes Re: [HAYTHI] <label>; html is escaped", async () => {
  const id = makeLead({ subject: "architecture" });
  sent = [];
  sendImpl = async () => ({ data: { id: "em_2" }, error: null });
  const res = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "Re: architecture", text: "<script>alert(1)</script> & merci" },
  });
  assert.equal(res.status, 200);
  assert.equal(sent[0].subject, "Re: [HAYTHI] Architecture SI");
  assert.match(sent[0].text, /<script>/);
  assert.doesNotMatch(sent[0].html, /<script>/);
  assert.match(sent[0].html, /&lt;script&gt;.*&amp; merci/);
  const ev = db.prepare("SELECT payload_json FROM lead_events WHERE lead_id = ? AND type = 'reply'").get(id);
  assert.equal(JSON.parse(ev.payload_json).subject, "Re: [HAYTHI] Architecture SI");
});

test("reply: upstream failure → 502, no event, status unchanged", async () => {
  const id = makeLead();
  sent = [];
  sendImpl = async () => ({ data: null, error: { name: "validation_error", message: "bad" } });
  const res = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "S", text: "T" },
  });
  assert.equal(res.status, 502);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM lead_events WHERE lead_id = ?").get(id).n, 0);
  assert.equal(getLead(db, id).status, "new");

  sendImpl = async () => {
    throw new Error("network");
  };
  const res2 = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "S", text: "T" },
  });
  assert.equal(res2.status, 502);
});

test("reply: validation, CSRF, unknown lead, header injection", async () => {
  const id = makeLead();
  sent = [];
  sendImpl = async () => ({ data: { id: "x" }, error: null });

  const empty = await api(`/leads/${id}/reply`, { method: "POST", body: { subject: "", text: "" } });
  assert.equal(empty.status, 400);

  const noCsrf = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "S", text: "T" },
    csrf: false,
  });
  assert.equal(noCsrf.status, 403);

  const unknown = await api("/leads/missing/reply", {
    method: "POST",
    body: { subject: "S", text: "T" },
  });
  assert.equal(unknown.status, 404);

  const inj = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "Hello\r\nBcc: evil@example.com", text: "T" },
  });
  assert.equal(inj.status, 200);
  assert.doesNotMatch(sent.at(-1).subject, /[\r\n]/);
  assert.equal(sent.length, 1);
});

test("reply to an anonymized lead → 409", async () => {
  const id = makeLead();
  await api(`/leads/${id}/anonymize`, { method: "POST" });
  sent = [];
  const res = await api(`/leads/${id}/reply`, {
    method: "POST",
    body: { subject: "S", text: "T" },
  });
  assert.equal(res.status, 409);
  assert.equal(sent.length, 0);
});

test("export returns json with email as attachment", async () => {
  const id = makeLead({ email: "export@example.com" });
  await api(`/leads/${id}`, { method: "PATCH", body: { status: "closed" } });
  const res = await api(`/leads/${id}/export`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /application\/json/);
  assert.match(res.headers.get("content-disposition"), /attachment/);
  const body = JSON.parse(await res.text());
  assert.equal(body.lead.email, "export@example.com");
  assert.equal(body.events.length, 1);
  assert.equal((await api("/leads/missing/export")).status, 404);
  assert.equal((await api(`/leads/${id}/export`, { session: false })).status, 401);
});

test("anonymize clears email", async () => {
  const id = makeLead({ email: "wipe@example.com" });
  sent = [];
  sendImpl = async () => ({ data: { id: "x" }, error: null });
  await api(`/leads/${id}/reply`, { method: "POST", body: { subject: "S", text: "secret body" } });

  const res = await api(`/leads/${id}/anonymize`, { method: "POST" });
  assert.equal(res.status, 200);
  const lead = getLead(db, id);
  assert.equal(lead.email, "");
  assert.equal(lead.name, "");
  assert.equal(lead.company, "");
  assert.equal(lead.message, "");
  assert.equal(lead.ip_hash, null);
  assert.equal(lead.subject, "web-dev");

  const events = db.prepare("SELECT * FROM lead_events WHERE lead_id = ?").all(id);
  assert.ok(events.some((e) => e.type === "anonymized"));
  assert.ok(events.every((e) => !e.payload_json.includes("secret body")));

  assert.equal((await api(`/leads/${id}/anonymize`, { method: "POST", csrf: false })).status, 403);
  assert.equal((await api("/leads/missing/anonymize", { method: "POST" })).status, 404);
});

test("DELETE removes lead and events", async () => {
  const id = makeLead();
  await api(`/leads/${id}`, { method: "PATCH", body: { status: "spam" } });
  assert.equal((await api(`/leads/${id}`, { method: "DELETE", csrf: false })).status, 403);
  assert.ok(getLead(db, id));

  const res = await api(`/leads/${id}`, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.equal(getLead(db, id), null);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM lead_events WHERE lead_id = ?").get(id).n, 0);
  assert.equal((await api(`/leads/${id}`, { method: "DELETE" })).status, 404);
});

test("GET /me returns admin email; logout destroys session", async () => {
  const token = auth.createSession(db, "u1");
  const headers = {
    cookie: `${auth.COOKIE_NAME}=${token}; haythi_csrf=${CSRF}`,
    "x-csrf-token": CSRF,
  };
  const me = await fetch(`${base}/api/admin/me`, { headers });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).email, EMAIL);

  const out = await fetch(`${base}/api/admin/logout`, { method: "POST", headers });
  assert.equal(out.status, 200);
  const cleared = out.headers.getSetCookie().join(";");
  assert.match(cleared, /haythi_admin=;/);
  const again = await fetch(`${base}/api/admin/me`, { headers });
  assert.equal(again.status, 401);
});

function login(body) {
  return fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("login: success sets session + csrf cookies; replayed TOTP code rejected", async () => {
  const code = totpCode(-1);
  const ok = await login({ email: EMAIL, password: PASSWORD, totp: code });
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { ok: true });
  const cookies = ok.headers.getSetCookie();
  const session = cookies.find((c) => c.startsWith("haythi_admin="));
  const csrf = cookies.find((c) => c.startsWith("haythi_csrf="));
  assert.ok(session && /HttpOnly/.test(session));
  assert.ok(csrf && !/HttpOnly/.test(csrf));

  const replay = await login({ email: EMAIL, password: PASSWORD, totp: code });
  assert.equal(replay.status, 401);
});

test("login: wrong password / wrong or missing TOTP / unknown user → 401", async () => {
  assert.equal((await login({ email: EMAIL, password: "nope", totp: totpCode(1) })).status, 401);
  assert.equal((await login({ email: EMAIL, password: PASSWORD, totp: "000000" })).status, 401);
  assert.equal((await login({ email: EMAIL, password: PASSWORD })).status, 401);
  assert.equal(
    (await login({ email: "ghost@haythi.mg", password: PASSWORD, totp: totpCode(1) })).status,
    401,
  );
  assert.equal((await login({ nope: true })).status, 400);
});

test("login: rate-limited after too many failures", async () => {
  const s = await listen(buildApp({ loginMax: 3 }));
  try {
    const url = `http://127.0.0.1:${s.address().port}/api/admin/login`;
    const attempt = () =>
      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: EMAIL, password: "bad", totp: "000000" }),
      });
    for (let i = 0; i < 3; i++) assert.equal((await attempt()).status, 401);
    assert.equal((await attempt()).status, 429);
  } finally {
    await new Promise((r) => s.close(r));
  }
});
