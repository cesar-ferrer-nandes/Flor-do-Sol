// ================= CONSTANTES GLOBAIS =================

// Número do WhatsApp da loja (centralizado para evitar duplicação)
const WHATSAPP_NUMBER = "5511999999999";

// ================= ESTADO DO CARRINHO =================

// Carrega o carrinho da sessão (sessionStorage) ou inicia vazio
// sessionStorage persiste entre páginas na mesma aba, mas é limpo ao fechar a aba
let cart = JSON.parse(sessionStorage.getItem("flordosol-cart")) || [];

// Persiste o carrinho na sessão atual
function saveCart() {
  sessionStorage.setItem("flordosol-cart", JSON.stringify(cart));
}

// Adiciona um produto ao carrinho
// Só mescla por nome se ambos (existente e novo) NÃO tiverem personalização
function addToCart(product) {
  const semPersonalizacao = !product.personalizacao;
  const existing = semPersonalizacao
    ? cart.find(p => p.name === product.name && !p.personalizacao)
    : undefined;

  if (existing) {
    existing.qty = (existing.qty || 1) + (product.qty || 1);
  } else {
    product.qty = product.qty || 1;
    cart.push(product);
  }

  saveCart();
  updateCartUI();
}

// Atualiza o badge do carrinho no navbar
function updateCartUI() {
  const count = document.getElementById("cart-count");
  if (count) {
    count.innerText = cart.length;
  }
}

// Inicializa o badge ao carregar a página (executa antes da navbar ser injetada;
// components.js chama updateCartUI novamente após injeção da navbar)
document.addEventListener("DOMContentLoaded", updateCartUI);
