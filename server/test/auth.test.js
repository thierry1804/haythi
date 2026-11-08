import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import * as OTPAuth from "otpauth";

let tempDir;
let db;
let auth;

before(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "haythi-auth-test-"));
  const { openDb } = await import("../src/db.js");
  db = openDb(join(tempDir, "test.sqlite"));
  auth = await import("../src/auth.js");
  db.prepare(
    "INSERT INTO admin_user (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
  ).run("u1", "a@haythi.mg", "x", new Date().toISOString());
});

after(async () => {
  db.close();
  await rm(tempDir, { recursive: true, force: true });
});

function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(b) {
      this.body = b;
      return this;
    },
  };
}

test("hashPassword verifies", async () => {
  const hash = await auth.hashPassword("correct horse");
  assert.ok(hash.startsWith("$argon2id$"));
  assert.equal(await auth.verifyPassword(hash, "correct horse"), true);
  assert.equal(await auth.verifyPassword(hash, "wrong"), false);
  assert.equal(await auth.verifyPassword("garbage", "x"), false);
});

test("requireAdmin rejects missing cookie with 401", () => {
  const res = mockRes();
  let called = false;
  auth.requireAdmin({ headers: {}, app: { locals: { db } } }, res, () => {
    called = true;
  });
  assert.equal(res.statusCode, 401);
  assert.equal(called, false);
});

test("requireAdmin accepts valid session and rejects unknown/expired", () => {
  const token = auth.createSession(db, "u1");
  const stored = db.prepare("SELECT token_hash FROM sessions").all();
  assert.ok(stored.every((r) => r.token_hash !== token), "token must be hashed");

  const req = {
    headers: { cookie: `${auth.COOKIE_NAME}=${token}` },
    app: { locals: { db } },
  };
  let called = false;
  auth.requireAdmin(req, mockRes(), () => {
    called = true;
  });
  assert.equal(called, true);
  assert.equal(req.admin.email, "a@haythi.mg");

  const bad = mockRes();
  auth.requireAdmin(
    { headers: { cookie: `${auth.COOKIE_NAME}=nope` }, app: { locals: { db } } },
    bad,
    () => assert.fail("must not pass"),
  );
  assert.equal(bad.statusCode, 401);

  db.prepare("UPDATE sessions SET expires_at = ?").run(new Date(0).toISOString());
  const expired = mockRes();
  auth.requireAdmin(req, expired, () => assert.fail("must not pass"));
  assert.equal(expired.statusCode, 401);
});

test("verifyTotp accepts current window", () => {
  const secret = auth.generateTotpSecret();
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  assert.equal(auth.verifyTotp(secret, totp.generate()), true);
  assert.equal(auth.verifyTotp(secret, "000000" === totp.generate() ? "111111" : "000000"), false);
  assert.equal(auth.verifyTotp(secret, "abc"), false);
});

test("session cookie flags", () => {
  const prev = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    const c = auth.sessionCookie("tok");
    assert.match(c, /^haythi_admin=tok/);
    assert.match(c, /HttpOnly/);
    assert.match(c, /Secure/);
    assert.match(c, /SameSite=Strict/);
    assert.match(c, /Path=\//);
  } finally {
    process.env.NODE_ENV = prev;
  }
});
