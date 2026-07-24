const form = document.querySelector(".talentos-form");
const btn = document.querySelector(".talentos-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  btn.textContent = "Cadastro Enviado ✓";
  btn.disabled = true;

  form.submit();  
});