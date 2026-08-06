const crypto = require("node:crypto");
const db = require("./db");

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function hashPassword(password) {
  return crypto.scryptSync(password, "ac-consultoria-salt", 64).toString("hex");
}

function createAdmin(username, password) {
  const hash = hashPassword(password);
  db.prepare(
    "INSERT INTO admins (username, password_hash) VALUES (?, ?)"
  ).run(username, hash);
}

function getAdminByUsername(username) {
  return db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
}

function createSession(adminId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  db.prepare(
    "INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, adminId, expiresAt);
  return token;
}

function getSession(token) {
  const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  return session;
}

function destroySession(token) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

function parseCookies(header = "") {
  const cookies = {};
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) cookies[key] = decodeURIComponent(rest.join("="));
  }
  return cookies;
}

module.exports = {
  SESSION_TTL_MS,
  hashPassword,
  createAdmin,
  getAdminByUsername,
  createSession,
  getSession,
  destroySession,
  parseCookies,
};