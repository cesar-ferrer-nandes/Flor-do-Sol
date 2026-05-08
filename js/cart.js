// ================= CONSTANTES GLOBAIS =================

// Número do WhatsApp da loja (centralizado para evitar duplicação)
const WHATSAPP_NUMBER = "5511999999999";

// ================= ESTADO DO CARRINHO =================

// Carrega o carrinho do localStorage ou inicia vazio
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Persiste o carrinho no localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Adiciona um produto ao carrinho (incrementa quantidade se já existir)
function addToCart(product) {
  const existing = cart.find(p => p.name === product.name);

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
