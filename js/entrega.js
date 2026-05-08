const ENTREGA_KEY = "flordosol-entrega";

const EntregaElements = {
  section: document.getElementById("entrega-section"),
  form: document.getElementById("form-entrega"),
  resumo: document.getElementById("entrega-resumo"),
  btnLimpar: document.getElementById("btn-limpar-entrega"),
  btnEditar: document.getElementById("btn-editar-entrega"),
};

const EntregaFields = {
  nome: document.querySelector('[name="nome"]'),
  cep: document.querySelector('[name="cep"]'),
  rua: document.querySelector('[name="rua"]'),
  numero: document.querySelector('[name="numero"]'),
  complemento: document.querySelector('[name="complemento"]'),
  bairro: document.querySelector('[name="bairro"]'),
  cidade: document.querySelector('[name="cidade"]'),
};

const CAMPOS_OBRIGATORIOS = ["nome", "cep", "rua", "numero", "bairro", "cidade"];

function formatarCEP(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function validarCEP(cep) {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return false;
  return true;
}

function mostrarErro(campo, mensagem) {
  const wrapper = campo.closest("div");
  const erroEl = wrapper.querySelector(".erro");
  if (!erroEl) return;
  campo.classList.add("border-red-400", "focus:border-red-400");
  campo.classList.remove("focus:border-[#1a2e1a]");
  erroEl.textContent = mensagem;
  erroEl.classList.remove("hidden");
}

function limparErro(campo) {
  const wrapper = campo.closest("div");
  const erroEl = wrapper.querySelector(".erro");
  if (!erroEl) return;
  campo.classList.remove("border-red-400", "focus:border-red-400");
  campo.classList.add("focus:border-[#1a2e1a]");
  erroEl.classList.add("hidden");
}

function limparTodosErros() {
  Object.values(EntregaFields).forEach(campo => {
    if (campo) limparErro(campo);
  });
}

function validarFormulario() {
  let valido = true;
  limparTodosErros();

  if (!EntregaFields.nome.value.trim() || EntregaFields.nome.value.trim().length < 2) {
    mostrarErro(EntregaFields.nome, "Informe um nome válido.");
    valido = false;
  }

  const cepDigits = EntregaFields.cep.value.replace(/\D/g, "");
  if (!validarCEP(EntregaFields.cep.value)) {
    mostrarErro(EntregaFields.cep, "CEP inválido. Use 8 dígitos.");
    valido = false;
  }

  if (!EntregaFields.rua.value.trim()) {
    mostrarErro(EntregaFields.rua, "Informe a rua.");
    valido = false;
  }

  if (!EntregaFields.numero.value.trim()) {
    mostrarErro(EntregaFields.numero, "Informe o número.");
    valido = false;
  }

  if (!EntregaFields.bairro.value.trim()) {
    mostrarErro(EntregaFields.bairro, "Informe o bairro.");
    valido = false;
  }

  if (!EntregaFields.cidade.value.trim()) {
    mostrarErro(EntregaFields.cidade, "Informe a cidade.");
    valido = false;
  }

  return valido;
}

function salvarDadosEntrega() {
  const dados = {
    nome: EntregaFields.nome.value.trim(),
    cep: EntregaFields.cep.value.trim(),
    rua: EntregaFields.rua.value.trim(),
    numero: EntregaFields.numero.value.trim(),
    complemento: EntregaFields.complemento.value.trim(),
    bairro: EntregaFields.bairro.value.trim(),
    cidade: EntregaFields.cidade.value.trim(),
  };
  sessionStorage.setItem(ENTREGA_KEY, JSON.stringify(dados));
  return dados;
}

function carregarDadosEntrega() {
  const raw = sessionStorage.getItem(ENTREGA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function preencherFormulario(dados) {
  if (!dados) return;
  EntregaFields.nome.value = dados.nome || "";
  EntregaFields.cep.value = dados.cep || "";
  EntregaFields.rua.value = dados.rua || "";
  EntregaFields.numero.value = dados.numero || "";
  EntregaFields.complemento.value = dados.complemento || "";
  EntregaFields.bairro.value = dados.bairro || "";
  EntregaFields.cidade.value = dados.cidade || "";
}

function mostrarResumo(dados) {
  if (!dados) return;
  document.getElementById("resumo-nome").textContent = dados.nome;
  document.getElementById("resumo-endereco").textContent =
    `${dados.rua}, ${dados.numero}${dados.complemento ? " - " + dados.complemento : ""}`;
  document.getElementById("resumo-bairro").textContent = dados.bairro;
  document.getElementById("resumo-cidade").textContent = `${dados.cidade} | CEP: ${dados.cep}`;
  EntregaElements.form.classList.add("hidden");
  EntregaElements.resumo.classList.remove("hidden");
}

function mostrarFormulario() {
  EntregaElements.form.classList.remove("hidden");
  EntregaElements.resumo.classList.add("hidden");
}

function limparFormulario() {
  Object.values(EntregaFields).forEach(campo => {
    if (campo) campo.value = "";
  });
  limparTodosErros();
  sessionStorage.removeItem(ENTREGA_KEY);
}

function buscarCEP(cep) {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return;

  const url = `https://viacep.com.br/ws/${digits}/json/`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then(data => {
      if (data.erro) {
        mostrarErro(EntregaFields.cep, "CEP não encontrado.");
        return;
      }
      limparErro(EntregaFields.cep);
      EntregaFields.rua.value = data.logradouro || "";
      EntregaFields.bairro.value = data.bairro || "";
      EntregaFields.cidade.value = data.localidade || "";
    })
    .catch(() => {
      mostrarErro(EntregaFields.cep, "Erro ao consultar CEP. Digite manualmente.");
    });
}

EntregaElements.form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validarFormulario()) return;
  const dados = salvarDadosEntrega();
  mostrarResumo(dados);
});

EntregaElements.btnLimpar.addEventListener("click", function () {
  limparFormulario();
});

EntregaElements.btnEditar.addEventListener("click", function () {
  const dados = carregarDadosEntrega();
  if (dados) preencherFormulario(dados);
  mostrarFormulario();
});

EntregaFields.cep.addEventListener("input", function () {
  this.value = formatarCEP(this.value);
  limparErro(this);
});

EntregaFields.cep.addEventListener("blur", function () {
  const digits = this.value.replace(/\D/g, "");
  if (digits.length === 8) {
    buscarCEP(this.value);
  } else if (this.value) {
    mostrarErro(this, "CEP incompleto. Digite 8 dígitos.");
  }
});

Object.values(EntregaFields).forEach(campo => {
  if (!campo) return;
  campo.addEventListener("focus", function () {
    limparErro(this);
  });
  campo.addEventListener("input", function () {
    limparErro(this);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const dados = carregarDadosEntrega();
  if (dados) {
    preencherFormulario(dados);
    mostrarResumo(dados);
  }
});
