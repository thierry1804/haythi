#!/usr/bin/env node
// Usage: node scripts/create-admin.js <email> <password>
// Upsert l'unique admin_user et affiche l'URL otpauth (une seule fois).
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { openDb } from "../src/db.js";
import { generateTotpSecret, hashPassword, totpUrl } from "../src/auth.js";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.js <email> <password>");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Le mot de passe doit faire au moins 12 caractères.");
  process.exit(1);
}

const db = openDb(process.env.DATABASE_PATH || "data/haythi.sqlite");
try {
  const passwordHash = await hashPassword(password);
  const secret = generateTotpSecret();
  const existing = db.prepare("SELECT id FROM admin_user LIMIT 1").get();
  if (existing) {
    db.prepare(
      "UPDATE admin_user SET email = ?, password_hash = ?, totp_secret = ? WHERE id = ?",
    ).run(email, passwordHash, secret, existing.id);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(existing.id);
  } else {
    db.prepare(
      "INSERT INTO admin_user (id, email, password_hash, totp_secret, created_at) VALUES (?, ?, ?, ?, ?)",
    ).run(randomUUID(), email, passwordHash, secret, new Date().toISOString());
  }
  console.log(`Admin enregistré : ${email}`);
  console.log("URL TOTP (à scanner maintenant, non réaffichée) :");
  console.log(totpUrl(secret, email));
} finally {
  db.close();
}
