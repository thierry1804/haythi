import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import * as OTPAuth from "otpauth";

let tempDir;
let db;
let auth;
let prevSecret;

before(async () => {
  prevSecret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "test-secret";
  tempDir = await mkdtemp(join(tmpdir(), "haythi-auth-test-"));
  const { openDb } = await import("../src/db.js");
  db = openDb(join(tempDir, "test.sqlite"));
  auth = await import("../src/auth.js");
  db.prepare(
    "INSERT INTO admin_user (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
  ).run("u1", "a@haythi.mg", "x", new Date().toISOString());
});

after(async () => {
  if (prevSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = prevSecret;
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

function withEnv(vars, fn) {
  const prev = {};
  for (const k of Object.keys(vars)) prev[k] = process.env[k];
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(prev)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test("session cookie flags (production)", () => {
  withEnv({ NODE_ENV: "production" }, () => {
    const c = auth.sessionCookie("tok");
    assert.match(c, /^haythi_admin=tok/);
    assert.match(c, /HttpOnly/);
    assert.match(c, /Secure/);
    assert.match(c, /SameSite=Strict/);
    assert.match(c, /Path=\//);
  });
});

test("cookie is Secure unless NODE_ENV=development", () => {
  for (const env of [undefined, "", "test", "staging", "prod", "Production"]) {
    withEnv({ NODE_ENV: env }, () => {
      assert.equal(auth.sessionCookieOptions().secure, true, `NODE_ENV=${env}`);
      assert.match(auth.sessionCookie("t"), /Secure/);
    });
  }
  withEnv({ NODE_ENV: "development" }, () => {
    assert.equal(auth.sessionCookieOptions().secure, false);
    assert.doesNotMatch(auth.sessionCookie("t"), /Secure/);
  });
});

test("SESSION_SECRET is required unless NODE_ENV=development", () => {
  for (const env of ["production", undefined, "", "test", "staging"]) {
    withEnv({ NODE_ENV: env, SESSION_SECRET: undefined }, () => {
      assert.throws(() => auth.getSessionSecret(), /SESSION_SECRET/, `NODE_ENV=${env}`);
      assert.throws(() => auth.createSession(db, "u1"), /SESSION_SECRET/);
    });
    withEnv({ NODE_ENV: env, SESSION_SECRET: "s3cret" }, () => {
      assert.equal(auth.getSessionSecret(), "s3cret");
      assert.ok(auth.createSession(db, "u1"));
    });
  }
  withEnv({ NODE_ENV: "development", SESSION_SECRET: undefined }, () => {
    assert.ok(auth.getSessionSecret());
    assert.ok(auth.createSession(db, "u1"));
  });
});
