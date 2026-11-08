# HAYTHI Back-office Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-operator back-office to manage contact leads (reply + RGPD) and view first-party visit stats, with Dockerized admin UI only and the existing host Express API extended.

**Architecture:** Extend `/opt/haythi-api` (repo `server/`) with SQLite, session auth (Argon2id + TOTP), lead persistence, reply via Resend, beacon/stats. Serve SPA from `admin/` in Docker on `127.0.0.1:8090`, exposed as `admin.haythi.mg` behind Cloudflare Access with same-site `/api` proxy to the host API.

**Tech Stack:** Node 20+, Express, better-sqlite3, argon2, otplib, cookie-session or signed cookie store in SQLite, Zod, Resend, React+Vite+Nginx Alpine (admin), Docker Compose (UI only).

**Spec:** `docs/superpowers/specs/2026-11-08-backoffice-design.md`

## Global Constraints

- Dockerize **admin UI only**; API stays on host systemd.
- Single admin user; Cloudflare Access + app TOTP required.
- Persist leads only after anti-spam/validation pass; honeypot/timing/spam silent OK → no DB row.
- Lead statuses: `new | in_progress | replied | closed | spam`.
- Retention: delete when processing finished (no 24‑month keep); UI must nudge purge of `closed`.
- Reply: To prospect, From `RESEND_FROM`, Reply-To + Cc `contact@haythi.mg`, text+HTML, store body in `lead_events`.
- Privacy landing text **before** enabling `/api/t` beacon.
- Start with empty DB (no email import).
- Session cookies same-site on `admin.haythi.mg` via proxying `/api/*` there.
- FR-only admin UI; noindex; no secrets in Docker image.
- Tests: Node built-in `node:test` + `node:assert/strict` under `server/test/`.

## Review Focus

- Honeypot/timing/spam paths still return `{ ok: true }` **without** creating a lead (Task 2).
- Unauthenticated caller cannot list/export/delete leads (Task 3–4).
- Anonymize removes PII but keeps non-identifying audit skeleton (Task 4).
- Beacon accepts only allowlisted fields; rejects huge bodies / floods via rate limit (Task 5).
- `/api/t` not wired on the public front until privacy copy is deployed (Task 8).

## File map

| Path | Role |
|------|------|
| `server/src/db.js` | Open SQLite, migrate schema |
| `server/src/leads.js` | Lead CRUD, events, anonymize, export payload |
| `server/src/auth.js` | Password hash, TOTP, sessions, requireAdmin middleware |
| `server/src/visits.js` | Beacon ingest + daily aggregates |
| `server/src/adminRoutes.js` | `/api/admin/*` router |
| `server/src/index.js` | Mount routers; persist on contact; CORS/cookies for admin |
| `server/scripts/create-admin.js` | One-shot admin bootstrap |
| `server/.env.example` | New secrets documented |
| `server/test/*.test.js` | API/unit tests |
| `admin/` | Vite React SPA + Dockerfile + compose |
| `server/deploy/apache-admin.conf.snippet` | Vhost admin + `/api` proxy |
| `src/components/Privacy.tsx` / `src/i18n.tsx` | Privacy copy |
| `src/analytics.ts` + App mount | Beacon (after privacy) |

---

### Task 1: SQLite schema + `db.js`

**Files:**
- Create: `server/src/db.js`
- Create: `server/test/db.test.js`
- Modify: `server/package.json` (dep `better-sqlite3`, script `test`)

**Interfaces:**
- Produces: `openDb(filePath: string) -> Database` (better-sqlite3); runs migrations creating tables `admin_user`, `sessions`, `leads`, `lead_events`, `visits_daily`
- `leads` columns at minimum: `id TEXT PK`, `created_at TEXT`, `status TEXT`, `name TEXT`, `company TEXT`, `email TEXT`, `subject TEXT`, `message TEXT`, `lang TEXT`, `email_status TEXT`, `ip_hash TEXT NULL`
- `lead_events`: `id`, `lead_id`, `created_at`, `type`, `payload_json`
- `visits_daily`: `day TEXT`, `path TEXT`, `referrer_host TEXT`, `lang TEXT`, `hits INTEGER`, PK `(day,path,referrer_host,lang)`

- [ ] **Step 1: Write failing test** `server/test/db.test.js` — `test('openDb creates leads table')` asserts `PRAGMA table_info(leads)` contains `status` and `email`

- [ ] **Step 2: Run test — expect FAIL**

Run: `cd server && node --test test/db.test.js`  
Expected: FAIL (module missing)

- [ ] **Step 3: Implement `openDb` + migrations in `server/src/db.js`; add dependency**

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add server/src/db.js server/test/db.test.js server/package.json server/package-lock.json
git commit -m "feat(server): add SQLite schema for back-office"
```

---

### Task 2: Persist legitimate contacts as leads

**Files:**
- Create: `server/src/leads.js`
- Create: `server/test/leads-persist.test.js`
- Modify: `server/src/index.js` (after anti-spam + turnstile + quota OK, before/at Resend: `createLead`; set `email_status` on Resend failure/success)
- Modify: `server/.env.example` (`DATABASE_PATH=data/haythi.sqlite`)

**Interfaces:**
- Consumes: `openDb`
- Produces:
  - `createLead(db, { name, company, email, subject, message, lang, ipHash }) -> { id }`
  - `setLeadEmailStatus(db, id, status: 'sent'|'failed'|'partial') -> void`
  - `getLead(db, id) -> lead | null`
- Spec: honeypot / timing / `looksLikeSpam` paths must **not** call `createLead`

- [ ] **Step 1: Write failing tests**
  - `test('createLead inserts status new')`
  - `test('honeypot path does not insert')` — extract or simulate the gate: call a small `shouldPersistContact(data, { nodeEnv })` helper returning false for honeypot/timing/spam; assert false + no insert when testing index integration with mocked req if feasible. Minimum: unit-test helper used by `index.js` before insert.

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `leads.js` + `shouldPersistContact` + wire `index.js`**

Persist only when current code would proceed to Resend send. On Resend throw/reject after insert → `email_status=failed` (still keep row).

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add server/src/leads.js server/src/index.js server/test/leads-persist.test.js server/.env.example
git commit -m "feat(server): persist legitimate contact leads in SQLite"
```

---

### Task 3: Admin auth (Argon2id + TOTP + sessions)

**Files:**
- Create: `server/src/auth.js`
- Create: `server/scripts/create-admin.js`
- Create: `server/test/auth.test.js`
- Modify: `server/package.json` (`argon2`, `otpauth` or `otplib`, `cookie`)
- Modify: `server/.env.example` (`SESSION_SECRET`, `ADMIN_ORIGIN=https://admin.haythi.mg`)

**Interfaces:**
- Produces:
  - `hashPassword(password: string) -> Promise<string>`
  - `verifyPassword(hash, password) -> Promise<boolean>`
  - `createSession(db, userId) -> token` (random 32+ bytes, store hash in `sessions`)
  - `requireAdmin(req, res, next)` — reads cookie `haythi_admin`, loads session, attaches `req.admin`
  - `verifyTotp(secret, token) -> boolean`
  - Cookie: `HttpOnly`, `Secure` in production, `SameSite=Strict`, `Path=/`
- `create-admin.js`: CLI email + password → upsert single `admin_user`, print TOTP otpauth URL once

- [ ] **Step 1: Write failing tests**
  - `test('hashPassword verifies')`
  - `test('requireAdmin rejects missing cookie with 401')`
  - `test('verifyTotp accepts current window')`

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `auth.js` + `create-admin.js`**

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add server/src/auth.js server/scripts/create-admin.js server/test/auth.test.js server/package.json server/package-lock.json server/.env.example
git commit -m "feat(server): admin Argon2 sessions and TOTP helpers"
```

---

### Task 4: Admin leads API (list, reply, RGPD)

**Files:**
- Create: `server/src/adminRoutes.js`
- Create: `server/test/admin-leads.test.js`
- Modify: `server/src/index.js` — mount admin router; expand CORS for `ADMIN_ORIGIN` with `credentials: true` and methods `GET,POST,PATCH,DELETE,OPTIONS`; allow `Cookie` / CSRF header
- Extend: `server/src/leads.js` — `listLeads`, `updateStatus`, `addEvent`, `anonymizeLead`, `deleteLead`, `exportLead`

**Interfaces:**
- Produces routes (all except login behind `requireAdmin` + CSRF on mutating methods):
  - `POST /api/admin/login` `{ email, password, totp }` → Set-Cookie + `{ ok: true }`
  - `POST /api/admin/logout`
  - `GET /api/admin/me`
  - `GET /api/admin/leads?status=`
  - `GET /api/admin/leads/:id`
  - `PATCH /api/admin/leads/:id` `{ status }`
  - `POST /api/admin/leads/:id/reply` `{ subject, text }` → Resend To lead.email, Reply-To + Cc `contact@haythi.mg` (or `RESEND_TO`), store event `reply`
  - `GET /api/admin/leads/:id/export` → JSON attachment
  - `POST /api/admin/leads/:id/anonymize` → wipe name/email/company/message/ip_hash; event `anonymized`
  - `DELETE /api/admin/leads/:id`
- CSRF: double-submit cookie `haythi_csrf` checked against header `X-CSRF-Token` on PATCH/POST/DELETE

- [ ] **Step 1: Write failing tests** (in-memory db + inject router)
  - `test('GET leads without session → 401')`
  - `test('anonymize clears email')`
  - `test('export returns json with email')`

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement routes + wire index; mock Resend in reply test**

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add server/src/adminRoutes.js server/src/leads.js server/src/index.js server/test/admin-leads.test.js
git commit -m "feat(server): admin leads API with reply and GDPR actions"
```

---

### Task 5: Visit beacon + stats

**Files:**
- Create: `server/src/visits.js`
- Create: `server/test/visits.test.js`
- Modify: `server/src/adminRoutes.js` — `GET /api/admin/stats/visits?days=7|30`
- Modify: `server/src/index.js` — `POST /api/t` public, aggressive rate limit, Zod body `{ path, referrer?, lang? }`

**Interfaces:**
- Produces: `recordVisit(db, { path, referrerHost, lang, day })`; `getVisitStats(db, days) -> { days: [{ day, hits }], topReferrers: [...] }`
- Do **not** add front-end beacon in this task

- [ ] **Step 1: Write failing tests**
  - `test('recordVisit increments hits')`
  - `test('POST /api/t rejects path longer than 200')`
  - `test('stats requires admin')`

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement visits + routes**

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add server/src/visits.js server/src/adminRoutes.js server/src/index.js server/test/visits.test.js
git commit -m "feat(server): first-party visit beacon and admin stats"
```

---

### Task 6: Admin SPA scaffold + Docker

**Files:**
- Create: `admin/package.json`, `admin/vite.config.ts`, `admin/index.html`, `admin/src/main.tsx`, `admin/src/App.tsx`, `admin/src/api.ts` (fetch wrapper with credentials + CSRF)
- Create: `admin/Dockerfile`, `admin/docker-compose.yml`, `admin/nginx.conf`
- Create: `admin/.dockerignore`

**Interfaces:**
- Produces: static build; nginx (unprivileged, non-root) listens 8080; compose publishes `127.0.0.1:8090:8080`
- `api.ts`: `apiGet/apiPost/...` to same-origin `/api/admin/...`
- `index.html`: `<meta name="robots" content="noindex,nofollow">`

- [ ] **Step 1: Scaffold Vite React TS app under `admin/` with login stub page rendering « HAYTHI Admin »**

- [ ] **Step 2: Add Dockerfile multi-stage + nginx.conf security headers + compose**

- [ ] **Step 3: Verify build**

Run: `cd admin && npm install && npm run build`  
Expected: `dist/` exists  
Run: `docker compose -f admin/docker-compose.yml build`  
Expected: image builds (if Docker unavailable locally, note in commit message and still leave files)

- [ ] **Step 4: Commit**

```bash
git add admin
git commit -m "feat(admin): Dockerized SPA scaffold with noindex"
```

---

### Task 7: Admin UI screens (leads + stats + account)

**Files:**
- Create/modify under `admin/src/`: `pages/Login.tsx`, `Dashboard.tsx`, `Leads.tsx`, `LeadDetail.tsx`, `Account.tsx`, simple client router
- Wire CSRF: after login, store/read CSRF cookie for mutating calls

**Interfaces:**
- Consumes Task 4–5 API shapes
- Lead detail: status select, reply form, buttons Exporter / Anonymiser / Supprimer with confirm; banner if `status===closed` « Supprimer ce lead — rétention terminée »
- Dashboard: visit totals + count of `new` leads

- [ ] **Step 1: Implement pages against API client (manual browser check locally with API on :8787)**

- [ ] **Step 2: `npm run build` in `admin/` — expect success**

- [ ] **Step 3: Commit**

```bash
git add admin/src
git commit -m "feat(admin): dashboard, leads, reply and GDPR UI"
```

---

### Task 8: Privacy copy then public beacon

**Files:**
- Modify: `src/i18n.tsx` (`privacyBody` FR/EN) — mention mesure d’audience first-party agrégée, sans pubs tiers, pas de revente
- Modify: `src/components/Privacy.tsx` if needed to render updated copy
- Create: `src/analytics.ts` — `sendPageView()` fire-and-forget `POST /api/t` with path `/`, referrer host, lang
- Modify: `src/App.tsx` — call once on mount **after** privacy strings exist in same release

**Order in this task:** commit privacy text first, then beacon wiring in same release is OK only because deploy checklist (Task 9) ships privacy+front **before** enabling Apache `/api/t` if proxy not yet open — prefer: include `/api/t` location but front beacon in same `dist` deploy after privacy paragraph is live. Single release acceptable if privacy paragraph is in the same build as the beacon.

- [ ] **Step 1: Update privacy FR/EN strings**

- [ ] **Step 2: Add `analytics.ts` + mount in `App.tsx`**

- [ ] **Step 3: `npm run build` (repo root) — expect success**

- [ ] **Step 4: Commit**

```bash
git add src/i18n.tsx src/analytics.ts src/App.tsx src/components/Privacy.tsx
git commit -m "feat(front): privacy update and first-party visit beacon"
```

---

### Task 9: Deploy docs + Apache snippets

**Files:**
- Create: `server/deploy/apache-admin.conf.snippet` — vhost `admin.haythi.mg` → `127.0.0.1:8090`; `ProxyPass /api/ http://127.0.0.1:8787/api/`
- Modify: `server/deploy/nginx-api.conf.snippet` or add `apache-api-t.conf.snippet` for `POST /api/t`
- Create: `docs/backoffice-deploy.md` — ordered checklist from spec (API → admin proxy → create-admin → compose up → DNS → CF Access → privacy/front → verify)
- Modify: `README.md` — link to backoffice deploy doc

- [ ] **Step 1: Write snippets + deploy checklist with exact curl verify commands**

- [ ] **Step 2: Commit**

```bash
git add server/deploy docs/backoffice-deploy.md README.md
git commit -m "docs: back-office deploy checklist and Apache snippets"
```

---

## Execution handoff

After plan approval, implement task-by-task with TDD where tests are specified. Do not enable production `/api/t` traffic before privacy text is deployed.
