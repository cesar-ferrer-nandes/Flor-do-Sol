// ================= LOGIN / CADASTRO =================
// Controla a abertura/fechamento do modal de autenticação
// e alternância entre os formulários de login e cadastro.

function abrirLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.classList.remove("hidden");
}

function fecharLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.classList.add("hidden");
}

// Alterna entre as abas "Entrar" e "Cadastrar" no modal.
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

// Mostra feedback visual nos formulários
function mostrarFeedback(formId, mensagem, erro) {
  const form = document.getElementById(formId);
  if (!form) return;
  let feedback = form.querySelector('.auth-feedback');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.className = 'auth-feedback text-sm mt-4 text-center';
    form.appendChild(feedback);
  }
  feedback.textContent = mensagem;
  feedback.className = `auth-feedback text-sm mt-4 text-center ${erro ? 'text-red-500' : 'text-green-600'}`;
  if (!erro) feedback.classList.add('text-green-600');
}

// Inicializa: valida senha no cadastro e submete os formulários via API.
document.addEventListener("DOMContentLoaded", function () {
  const formEntrar = document.getElementById("form-entrar");
  const formCadastrar = document.getElementById("form-cadastrar");

  if (formEntrar) {
    formEntrar.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = this.querySelector('[name="email"]').value;
      const senha = this.querySelector('[name="senha"]').value;

      mostrarFeedback('form-entrar', 'Entrando...', false);
      try {
        await login(email, senha);
        mostrarFeedback('form-entrar', 'Login realizado!', false);
        setTimeout(() => { fecharLogin(); updateAuthUI(); }, 500);
      } catch (err) {
        mostrarFeedback('form-entrar', err.message, true);
      }
    });
  }

  if (formCadastrar) {
    formCadastrar.addEventListener("submit", async function (e) {
      e.preventDefault();
      const nome = this.querySelector('[name="nome"]').value;
      const email = this.querySelector('[name="email"]').value;
      const senha = this.querySelector('[name="senha"]').value;
      const confirmar = this.querySelector('[name="confirmar"]').value;

      if (senha !== confirmar) {
        mostrarFeedback('form-cadastrar', 'As senhas não conferem.', true);
        return;
      }

      mostrarFeedback('form-cadastrar', 'Criando conta...', false);
      try {
        const res = await cadastrar(nome, email, senha);
        mostrarFeedback('form-cadastrar', res.mensagem || 'Conta criada!', false);
        setTimeout(() => alternarAuth('entrar'), 1500);
      } catch (err) {
        mostrarFeedback('form-cadastrar', err.message, true);
      }
    });
  }
});

window.abrirLogin = abrirLogin;
window.fecharLogin = fecharLogin;
window.alternarAuth = alternarAuth;
