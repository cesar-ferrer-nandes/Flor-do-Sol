// ================= NOTIFICAÇÃO TOAST =================
// Exibe mensagens temporárias no canto inferior direito da tela.
// O container <div id="toast-container"> deve existir no HTML.
// A notificação some automaticamente após 3 segundos com animação.

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  // Remove o toast após 3s com animação fade-out
  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
