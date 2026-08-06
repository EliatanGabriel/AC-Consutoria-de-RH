(function () {
  const container = document.getElementById("vagas-container");

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

    return `
      <article class="vaga-card">
        <h2>${esc(vaga.titulo)}</h2>
        ${info ? `<div class="vaga-meta">${info}</div>` : ""}
        <p class="vaga-descricao">${esc(vaga.descricao)}</p>
        ${requisitos}
        <a class="btn" href="bancotalentos.html">Candidatar-se</a>
      </article>
    `;
  }

  async function carregarVagas() {
    try {
      const res = await fetch("/api/vagas");
      const vagas = await res.json();

      if (!vagas.length) {
        container.innerHTML =
          '<p class="vagas-vazio">Nenhuma vaga aberta no momento. Volte em breve!</p>';
        return;
      }

      container.innerHTML = vagas.map(renderVaga).join("");
    } catch (err) {
      container.innerHTML =
        '<p class="vagas-vazio">Não foi possível carregar as vagas. Tente novamente mais tarde.</p>';
    }
  }

  carregarVagas();
})();