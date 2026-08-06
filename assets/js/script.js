const form = document.querySelector(".talentos-form");
const btn = document.querySelector(".talentos-btn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const input = Object.fromEntries(new FormData(form).entries());

  const dados = {
    nome: input.nome || "",
    email: input.email || "",
    telefone: input.telefone || "",
    cidade: input.cidade || "",
    cargo: input.cargo || "",
    mensagem: input.mensagem || "",
    curriculo: form.curriculo?.files?.[0]?.name || "",
  };

  try {
    await fetch("/api/cadastros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  } catch (err) {
    // Fallback: mesmo que o sistema falhe, o envio por e-mail prossegue.
  }

  btn.textContent = "Cadastro Enviado ✓";
  btn.disabled = true;

  form.submit();
});