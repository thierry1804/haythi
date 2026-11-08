import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { openDb } from "../src/db.js";
import {
  contactRejectReason,
  createLead,
  getLead,
  setLeadEmailStatus,
  shouldPersistContact,
} from "../src/leads.js";

let tempDir;
let db;

const base = {
  name: "Jean Rakoto",
  company: "Acme",
  email: "jean@example.com",
  subject: "web-dev",
  message: "Bonjour, je souhaite un site vitrine pour mon entreprise.",
  lang: "FR",
  website: "",
};

before(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "haythi-leads-test-"));
  db = openDb(join(tempDir, "test.sqlite"));
});

after(async () => {
  db.close();
  await rm(tempDir, { recursive: true, force: true });
});

const count = () => db.prepare("SELECT COUNT(*) AS n FROM leads").get().n;

test("createLead inserts status new", () => {
  const { id } = createLead(db, { ...base });
  assert.ok(id);
  const lead = getLead(db, id);
  assert.equal(lead.status, "new");
  assert.equal(lead.name, base.name);
  assert.equal(lead.email, base.email);
  assert.equal(lead.subject, "web-dev");
  assert.equal(lead.lang, "FR");
  assert.equal(lead.ip_hash, null);
  assert.equal(lead.email_status, null);
  assert.ok(lead.created_at);
});

test("getLead returns null when missing", () => {
  assert.equal(getLead(db, "nope"), null);
});

test("setLeadEmailStatus updates email_status and keeps row", () => {
  const { id } = createLead(db, { ...base });
  setLeadEmailStatus(db, id, "failed");
  assert.equal(getLead(db, id).email_status, "failed");
  setLeadEmailStatus(db, id, "sent");
  assert.equal(getLead(db, id).email_status, "sent");
  setLeadEmailStatus(db, id, "partial");
  assert.equal(getLead(db, id).email_status, "partial");
});

test("setLeadEmailStatus rejects invalid status", () => {
  const { id } = createLead(db, { ...base });
  assert.throws(() => setLeadEmailStatus(db, id, "bogus"));
});

test("honeypot path does not insert", () => {
  const before = count();
  const data = { ...base, website: "http://bot.example" };
  assert.equal(shouldPersistContact(data, { nodeEnv: "development" }), false);
  assert.equal(contactRejectReason(data, { nodeEnv: "development" }), "HONEYPOT");
  assert.equal(count(), before);
});

test("timing path does not insert", () => {
  const now = Date.now();
  const tooFast = { ...base, startedAt: now - 100 };
  const tooOld = { ...base, startedAt: now - 1000 * 60 * 60 * 7 };
  assert.equal(shouldPersistContact(tooFast, { nodeEnv: "development", now }), false);
  assert.equal(shouldPersistContact(tooOld, { nodeEnv: "development", now }), false);
  assert.equal(contactRejectReason(tooFast, { nodeEnv: "development", now }), "TIMING");
});

test("missing startedAt rejected only in production", () => {
  assert.equal(shouldPersistContact(base, { nodeEnv: "development" }), true);
  assert.equal(shouldPersistContact(base, { nodeEnv: "production" }), false);
  assert.equal(contactRejectReason(base, { nodeEnv: "production" }), "MISSING_STARTED_AT");
});

test("spam path does not insert", () => {
  const spam = { ...base, message: "Buy viagra now, best prices around" };
  assert.equal(shouldPersistContact(spam, { nodeEnv: "development" }), false);
  assert.equal(contactRejectReason(spam, { nodeEnv: "development" }), "KEYWORD_SPAM");
});

test("legitimate contact is persisted", () => {
  const now = Date.now();
  const data = { ...base, startedAt: now - 5000 };
  assert.equal(shouldPersistContact(data, { nodeEnv: "production", now }), true);
  assert.equal(contactRejectReason(data, { nodeEnv: "production", now }), null);
});
