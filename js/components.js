// ================= CARREGAMENTO DE COMPONENTES =================

// Faz fetch de um arquivo HTML e injeta no elemento com o ID especificado
async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    element.innerHTML = html;
  } catch (err) {
    // Fallback: exibe mensagem amigável se o componente não carregar
    console.warn(`Erro ao carregar ${file}:`, err);
    element.innerHTML = `<p class="text-sm text-gray-400 p-4">Conteúdo indisponível</p>`;
  }
}

// ================= INICIALIZAÇÃO =================

document.addEventListener("DOMContentLoaded", async () => {
  // Carrega navbar e footer (a ordem importa: navbar primeiro para updateCartUI)
  await loadComponent("navbar", "components/navbar.html");
  await loadComponent("footer", "components/footer.html");

  // Re-sincroniza o badge do carrinho agora que a navbar existe no DOM
  const badge = document.getElementById("cart-count");
  if (badge) {
    const dados = JSON.parse(sessionStorage.getItem("flordosol-cart"));
    badge.innerText = dados ? dados.length : 0;
  }

  // Scroll reveal: ativa fade-in conforme o usuário rola a página
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

  // Destaca o link da página atual no navbar
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("header a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("text-[#aea100]");
    }
  });
});
