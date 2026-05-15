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
  // Carrega navbar, footer e modal de login (a ordem importa: navbar primeiro para updateCartUI)
  await loadComponent("navbar", "components/navbar.html");
  await loadComponent("modal-login", "components/modal-login.html");
  await loadComponent("footer", "components/footer.html");

  // Re-sincroniza os badges do carrinho e favoritos agora que a navbar existe no DOM
  const cartBadge = document.getElementById("cart-count");
  if (cartBadge) {
    const cartData = JSON.parse(localStorage.getItem("flordosol-cart"));
    cartBadge.innerText = cartData ? cartData.length : 0;
  }

  // Badge de favoritos: mostra o contador e oculta quando vazio
  const favBadge = document.getElementById("favoritos-count");
  if (favBadge) {
    const favData = JSON.parse(sessionStorage.getItem("flordosol-favoritos"));
    const count = favData ? favData.length : 0;
    favBadge.innerText = count;
    favBadge.classList.toggle("hidden", count === 0);
  }

  // Atualiza a UI de autenticação (login / nome do usuário)
  if (window.updateAuthUI) updateAuthUI();

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
  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) currentPage = "index.html";
  document.querySelectorAll("header a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("text-[#aea100]");
    }
  });
});
