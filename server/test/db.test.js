import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

let dbPath;
let tempDir;

before(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "haythi-db-test-"));
  dbPath = join(tempDir, "test.sqlite");
});

after(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

test("openDb creates leads table", async () => {
  const { openDb } = await import("../src/db.js");
  const db = openDb(dbPath);
  try {
    const columns = db.prepare("PRAGMA table_info(leads)").all();
    const names = columns.map((c) => c.name);
    assert.ok(names.includes("status"), "leads must have status column");
    assert.ok(names.includes("email"), "leads must have email column");
  } finally {
    db.close();
  }
});

test("openDb enables secure_delete", async () => {
  const { openDb } = await import("../src/db.js");
  const db = openDb(join(tempDir, "secure.sqlite"));
  try {
    assert.equal(db.pragma("secure_delete", { simple: true }), 1);
  } finally {
    db.close();
  }
});
