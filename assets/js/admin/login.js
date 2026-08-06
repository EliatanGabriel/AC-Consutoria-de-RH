(function () {
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorEl.hidden = true;

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || "Erro ao entrar.";
        errorEl.hidden = false;
        return;
      }

      window.location.href = "dashboard.html";
    } catch (err) {
      errorEl.textContent = "Erro de conexão. Tente novamente.";
      errorEl.hidden = false;
    }
  });
})();