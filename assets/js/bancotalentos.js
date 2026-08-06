(function () {
  // Lê o parâmetro "vaga" da URL, ex.: bancotalentos.html?vaga=Analista%20de%20RH
  const params = new URLSearchParams(window.location.search);
  const vaga = params.get("vaga");

  if (vaga) {
    // Campo oculto → vai enviado no e-mail pro cliente.
    document.getElementById("vaga").value = vaga;
    // Campo visível → a pessoa vê qual vaga está se candidatando.
    document.getElementById("vaga-nome").value = vaga;
  }

  // Se o candidato escolher uma vaga, remove o placeholder do campo.
  if (!vaga) {
    document.getElementById("vaga-nome").placeholder =
      "Clique em 'Candidatar-se' numa vaga para ela aparecer aqui";
  }
})();