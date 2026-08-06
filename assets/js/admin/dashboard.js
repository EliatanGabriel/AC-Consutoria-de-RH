(function () {
  const vagasList = document.getElementById("vagas-list");
  const cadastrosList = document.getElementById("cadastros-list");
  const form = document.getElementById("vaga-form");
  const novaVagaBtn = document.getElementById("nova-vaga-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const viewVagas = document.getElementById("view-vagas");
  const viewCadastros = document.getElementById("view-cadastros");
  const viewTitle = document.getElementById("admin-view-title");
  const viewSub = document.getElementById("admin-view-sub");
  const tabs = document.querySelectorAll(".admin-tab");

  let editandoId = null;

  function esc(texto) {
    return String(texto ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function statusLabel(status) {
    return status === "aberta" ? "Aberta" : "Fechada";
  }

  function abrirFormulario() {
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fecharFormulario() {
    form.hidden = true;
    form.reset();
    document.getElementById("vaga-id").value = "";
    editandoId = null;
    document.getElementById("save-btn").textContent = "Salvar Vaga";
  }

  function preencherFormulario(vaga) {
    editandoId = vaga.id;
    document.getElementById("vaga-id").value = vaga.id;
    document.getElementById("titulo").value = vaga.titulo || "";
    document.getElementById("descricao").value = vaga.descricao || "";
    document.getElementById("requisitos").value = vaga.requisitos || "";
    document.getElementById("local").value = vaga.local || "";
    document.getElementById("tipo").value = vaga.tipo || "";
    document.getElementById("salario").value = vaga.salario || "";
    document.getElementById("save-btn").textContent = "Atualizar Vaga";
    abrirFormulario();
  }

  async function listarVagas() {
    try {
      const res = await fetch("/api/admin/vagas");
      if (res.status === 401) {
        window.location.href = "login.html";
        return;
      }
      if (!res.ok) throw new Error("Erro ao carregar vagas");

      const vagas = await res.json();

      if (!vagas.length) {
        vagasList.innerHTML =
          '<p class="admin-vazio">Nenhuma vaga cadastrada. Clique em "+ Nova Vaga".</p>';
        return;
      }

      vagasList.innerHTML = vagas
        .map(
          (v) => `
        <div class="admin-row">
          <div class="admin-row-title">
            <strong>${esc(v.titulo)}</strong>
            <small>${esc(v.local || "Local não informado")}</small>
          </div>
          <span>${esc(v.tipo || "-")}</span>
          <span class="admin-status admin-status--${esc(v.status)}">${statusLabel(v.status)}</span>
          <div class="admin-row-actions">
            <button class="btn btn-sm btn-ghost" data-editar="${v.id}">Editar</button>
            <button class="btn btn-sm btn-danger" data-excluir="${v.id}">Excluir</button>
          </div>
        </div>
      `
        )
        .join("");

      vagasList.querySelectorAll("[data-editar]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const vaga = vagas.find((v) => v.id === Number(btn.dataset.editar));
          if (vaga) preencherFormulario(vaga);
        });
      });

      vagasList.querySelectorAll("[data-excluir]").forEach((btn) => {
        btn.addEventListener("click", () => excluirVaga(btn.dataset.excluir));
      });
    } catch (err) {
      vagasList.innerHTML =
        '<p class="admin-vazio">Não foi possível carregar as vagas.</p>';
    }
  }

  async function salvarVaga(dados) {
    const url = editandoId ? `/api/admin/vagas/${editandoId}` : "/api/admin/vagas";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao salvar vaga");
    }
  }

  async function excluirVaga(id) {
    if (!confirm("Excluir esta vaga?")) return;

    const res = await fetch(`/api/admin/vagas/${id}`, { method: "DELETE" });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    if (!res.ok) {
      alert("Não foi possível excluir a vaga.");
      return;
    }
    listarVagas();
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dados = {
      titulo: document.getElementById("titulo").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      requisitos: document.getElementById("requisitos").value.trim(),
      local: document.getElementById("local").value.trim(),
      tipo: document.getElementById("tipo").value.trim(),
      salario: document.getElementById("salario").value.trim(),
      status: "aberta",
    };

    try {
      await salvarVaga(dados);
      fecharFormulario();
      listarVagas();
    } catch (err) {
      alert(err.message);
    }
  });

  novaVagaBtn.addEventListener("click", () => {
    fecharFormulario();
    abrirFormulario();
    document.getElementById("titulo").focus();
  });

  cancelBtn.addEventListener("click", fecharFormulario);

  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "login.html";
  });

  /* Abas */
  const VIEWS = {
    vagas: {
      title: "Gerenciar Vagas",
      sub: "Adicione, edite e exclua as vagas exibidas no site.",
    },
    cadastros: {
      title: "Banco de Talentos",
      sub: "Candidatos que cadastraram currículo através do site.",
    },
  };

  function exibirAba(nome) {
    const ativa = VIEWS[nome];
    if (!ativa) return;
    viewTitle.textContent = ativa.title;
    viewSub.textContent = ativa.sub;

    const verVagas = nome === "vagas";
    viewVagas.hidden = !verVagas;
    viewCadastros.hidden = verVagas;
    novaVagaBtn.style.display = verVagas ? "" : "none";
    fecharFormulario();

    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.tab === nome);
    });
  }

  function formatarData(iso) {
    if (!iso) return "-";
    const d = new Date(iso.includes("T") ? iso : iso + "Z");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  async function listarCadastros() {
    try {
      const res = await fetch("/api/admin/cadastros");
      if (res.status === 401) {
        window.location.href = "login.html";
        return;
      }
      if (!res.ok) throw new Error("Erro ao carregar candidatos");

      const cadastros = await res.json();

      if (!cadastros.length) {
        cadastrosList.innerHTML =
          '<p class="admin-vazio">Nenhum candidato cadastrado ainda.</p>';
        return;
      }

      cadastrosList.innerHTML = cadastros
        .map(
          (c) => `
        <div class="admin-row">
          <div class="admin-row-title">
            <strong>${esc(c.nome)}</strong>
            <small>${esc([c.cargo, c.cidade].filter(Boolean).join(" • ") || "Sem cargo informado")}</small>
          </div>
          <div class="admin-cadastro-contato">
            <small>${esc(c.email)}</small>
            <small>${esc(c.telefone || "")}</small>
          </div>
          <span class="admin-cadastro-data">${esc(formatarData(c.created_at))}</span>
          <div class="admin-row-actions">
            <button class="btn btn-sm btn-danger" data-excluir-cadastro="${c.id}">Excluir</button>
          </div>
        </div>
      `
        )
        .join("");

      cadastrosList.querySelectorAll("[data-excluir-cadastro]").forEach((btn) => {
        btn.addEventListener("click", () => excluirCadastro(btn.dataset.excluirCadastro));
      });
    } catch (err) {
      cadastrosList.innerHTML =
        '<p class="admin-vazio">Não foi possível carregar os candidatos.</p>';
    }
  }

  async function excluirCadastro(id) {
    if (!confirm("Excluir este cadastro?")) return;

    const res = await fetch(`/api/admin/cadastros/${id}`, { method: "DELETE" });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }
    if (!res.ok) {
      alert("Não foi possível excluir o cadastro.");
      return;
    }
    listarCadastros();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      exibirAba(target);
      if (target === "cadastros") listarCadastros();
    });
  });

  listarVagas();
})();