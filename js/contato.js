// ================= FORMULÁRIO DE CONTATO =================

const form = document.getElementById("formContato");

// Ao submeter, envia os dados via WhatsApp em vez de um POST tradicional
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = form.nome.value;
  const email = form.email.value;
  const mensagem = form.mensagem.value;

  const texto = `*Novo contato*%0A%0ANome: ${nome}%0AEmail: ${email}%0A%0AMensagem:%0A${mensagem}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

  window.open(url, "_blank");
  alert("Mensagem enviada via WhatsApp!");
  form.reset();
});
