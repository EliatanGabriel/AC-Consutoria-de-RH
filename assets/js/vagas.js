(function () {
  const container = document.getElementById("vagas-container");

  const vagas = [
    {
      titulo: "Auxiliar Administrativo",
      descricao:
        "Apoio nas rotinas administrativas da empresa: atendimento, organização de documentos e suporte ao time.",
      requisitos:
        "Ensino médio completo, noções de Pacote Office e boa comunicação.",
      local: "São Paulo - SP",
      tipo: "CLT",
      salario: "R$ 1.800,00",
    },
    {
      titulo: "Analista de RH",
      descricao:
        "Atuação no recrutamento e seleção, triagem de currículos e apoio nos processos internos de RH.",
      requisitos:
        "Graduação em andamento ou concluída em RH, Psicologia ou áreas afins.",
      local: "Remoto",
      tipo: "CLT",
      salario: "R$ 2.800,00",
    },
    {
      titulo: "Assistente de Logística",
      descricao:
        "Controle de estoque, emissão de notas e acompanhamento de entregas.",
      requisitos: "Ensino médio completo e experiência com pacote Office.",
      local: "Campinas - SP",
      tipo: "Temporário",
      salario: "R$ 1.900,00",
    },
  ];

  function esc(texto) {
    return String(texto ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderVaga(vaga) {
    const info = [
      vaga.tipo && `<span class="vaga-badge">${esc(vaga.tipo)}</span>`,
      vaga.local && `<span class="vaga-local">📍 ${esc(vaga.local)}</span>`,
      vaga.salario && `<span class="vaga-salario">💰 ${esc(vaga.salario)}</span>`,
    ]
      .filter(Boolean)
      .join("");

    const requisitos = vaga.requisitos
      ? `<div class="vaga-requisitos"><h3>Requisitos</h3><p>${esc(vaga.requisitos)}</p></div>`
      : "";

    const vagaLink = encodeURIComponent(vaga.titulo);

    return `
      <article class="vaga-card">
        <h2>${esc(vaga.titulo)}</h2>
        ${info ? `<div class="vaga-meta">${info}</div>` : ""}
        <p class="vaga-descricao">${esc(vaga.descricao)}</p>
        ${requisitos}
        <a class="btn" href="bancotalentos.html?vaga=${vagaLink}">Candidatar-se</a>
      </article>
    `;
  }

  function carregarVagas() {
    if (!vagas.length) {
      container.innerHTML =
        '<p class="vagas-vazio">Nenhuma vaga aberta no momento. Volte em breve!</p>';
      return;
    }
    container.innerHTML = vagas.map(renderVaga).join("");
  }

  carregarVagas();
})();
