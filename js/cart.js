// ================= CONSTANTES GLOBAIS =================

// Número do WhatsApp da loja (fallback fixo enquanto API não carrega)
let WHATSAPP_NUMBER = "5511999999999";

// Tenta carregar o número da API
fetch('api/whatsapp.php')
  .then(r => r.ok ? r.json() : null)
  .then(d => { if (d && d.numero) WHATSAPP_NUMBER = d.numero; })
  .catch(() => {});

// ================= ESTADO DO CARRINHO =================

// Carrega o carrinho do localStorage (persiste entre sessões)
let cart = JSON.parse(localStorage.getItem("flordosol-cart")) || [];

// Persiste o carrinho no localStorage
function saveCart() {
  localStorage.setItem("flordosol-cart", JSON.stringify(cart));
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
