function abrirLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.classList.remove("hidden");
}

function fecharLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.classList.add("hidden");
}

function alternarAuth(modo) {
  document.querySelectorAll(".tab-auth").forEach(tab => {
    tab.classList.remove("active", "border-[#1a2e1a]", "text-[#1a2e1a]");
    tab.classList.add("border-transparent", "text-gray-400");
  });

  document.querySelectorAll(".auth-form").forEach(f => f.classList.add("hidden"));

  const tab = document.getElementById(`tab-${modo}`);
  const form = document.getElementById(`form-${modo}`);

  if (tab) {
    tab.classList.add("active", "border-[#1a2e1a]", "text-[#1a2e1a]");
    tab.classList.remove("border-transparent", "text-gray-400");
  }

  if (form) form.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".auth-form").forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (this.id === "form-cadastrar") {
        const senha = this.querySelector('[name="senha"]').value;
        const confirmar = this.querySelector('[name="confirmar"]').value;
        if (senha !== confirmar) {
          alert("As senhas não conferem.");
          return;
        }
      }

      fecharLogin();
      alert(this.id === "form-entrar" ? "Login realizado!" : "Cadastro realizado!");
    });
  });
});
