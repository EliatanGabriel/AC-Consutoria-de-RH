const express = require("express");
const path = require("node:path");
const db = require("./src/db");
const {
  hashPassword,
  createAdmin,
  getAdminByUsername,
  createSession,
  getSession,
  destroySession,
  parseCookies,
} = require("./src/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function requireAdmin(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const session = getSession(cookies.ac_session);
  if (!session) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  req.adminId = session.admin_id;
  next();
}

function seedAdmin() {
  const exists = db.prepare("SELECT COUNT(*) AS n FROM admins").get();
  if (exists.n === 0) {
    createAdmin(process.env.ADMIN_USER || "admin", process.env.ADMIN_PASSWORD || "admin123");
  }
}
seedAdmin();

app.use(express.static(path.join(__dirname)));

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const admin = getAdminByUsername(username || "");
  if (!admin || hashPassword(password || "") !== admin.password_hash) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = createSession(admin.id);
  res.cookie("ac_session", token, {
    httpOnly: true,
    maxAge: 12 * 60 * 60 * 1000,
    sameSite: "lax",
  });
  res.json({ ok: true });
});

app.post("/api/admin/logout", (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.ac_session) destroySession(cookies.ac_session);
  res.clearCookie("ac_session");
  res.json({ ok: true });
});

/* Vagas - públicas (somente abertas) */
app.get("/api/vagas", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, titulo, descricao, requisitos, local, tipo, salario
       FROM vagas WHERE status = 'aberta' ORDER BY created_at DESC`
    )
    .all();
  res.json(rows);
});

/* Vagas - admin (CRUD) */
app.get("/api/admin/vagas", requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, titulo, descricao, requisitos, local, tipo, salario, status, updated_at
       FROM vagas ORDER BY created_at DESC`
    )
    .all();
  res.json(rows);
});

app.post("/api/admin/vagas", requireAdmin, (req, res) => {
  const { titulo, descricao, requisitos, local, tipo, salario } = req.body || {};
  if (!titulo || !descricao) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios" });
  }
  const info = db
    .prepare(
      `INSERT INTO vagas (titulo, descricao, requisitos, local, tipo, salario)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(titulo, descricao, requisitos || "", local || "", tipo || "", salario || "");
  res.status(201).json({ id: info.lastInsertRowid });
});

app.put("/api/admin/vagas/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao, requisitos, local, tipo, salario, status } = req.body || {};
  const info = db
    .prepare(
      `UPDATE vagas SET
         titulo = ?, descricao = ?, requisitos = ?, local = ?, tipo = ?,
         salario = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .run(titulo, descricao, requisitos, local, tipo, salario, status, id);
  if (info.changes === 0) return res.status(404).json({ error: "Vaga não encontrada" });
  res.json({ ok: true });
});

app.delete("/api/admin/vagas/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare("DELETE FROM vagas WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Vaga não encontrada" });
  res.json({ ok: true });
});

/* Cadastros - públicos (banco de talentos) */
app.post("/api/cadastros", (req, res) => {
  const { nome, email, telefone, cidade, cargo, mensagem, curriculo } = req.body || {};
  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
  }
  const info = db
    .prepare(
      `INSERT INTO cadastros (nome, email, telefone, cidade, cargo, mensagem, curriculo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      nome,
      email,
      telefone || "",
      cidade || "",
      cargo || "",
      mensagem || "",
      curriculo || ""
    );
  res.status(201).json({ id: info.lastInsertRowid });
});

/* Cadastros - admin (listagem e exclusão) */
app.get("/api/admin/cadastros", requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, nome, email, telefone, cidade, cargo, mensagem, curriculo, created_at
       FROM cadastros ORDER BY created_at DESC, id DESC`
    )
    .all();
  res.json(rows);
});

app.delete("/api/admin/cadastros/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare("DELETE FROM cadastros WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Cadastro não encontrado" });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`AC Consultoria rodando em http://localhost:${PORT}`);
  const haveAdmin = db.prepare("SELECT COUNT(*) AS n FROM admins").get();
  if (haveAdmin.n > 0) {
    console.log(`Acesso admin criado com: ${process.env.ADMIN_USER || "admin"} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
  }
});