// ================= ELEMENTOS DO DOM =================

const container = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const info = document.getElementById("cart-info");
const emptyState = document.getElementById("empty-state");
const cartContainer = document.getElementById("cart-container");

// ================= RENDERIZAÇÃO =================

// Renderiza a lista de itens do carrinho
function renderCart() {
  if (cart.length === 0) {
    cartContainer.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  cartContainer.classList.remove("hidden");
  emptyState.classList.add("hidden");

  info.innerText = `${cart.length} itens`;

  container.innerHTML = cart.map((item, index) => `
    <div class="flex items-center gap-4 border-b pb-4">
      <div class="w-20 aspect-[4/5] bg-gray-200 rounded-lg"></div>
      <div class="flex-1">
        <h3 class="font-medium">${item.name}</h3>
        <p class="text-sm text-gray-400">Produto</p>
        <p class="font-bold mt-1">R$ ${item.price.toFixed(2)}</p>
        <div class="flex items-center gap-3 mt-2">
          <button onclick="changeQty(${index}, -1)"
                  class="px-2 bg-[#1a2e1a] text-white rounded">-</button>
          <span>${item.qty || 1}</span>
          <button onclick="changeQty(${index}, 1)"
                  class="px-2 bg-[#1a2e1a] text-white rounded">+</button>
        </div>
      </div>
      <button onclick="removeItem(${index})">🗑️</button>
    </div>
  `).join("");

  updateTotal();
}

// ================= AÇÕES =================

// Altera a quantidade de um item (delta = +1 ou -1)
function changeQty(index, delta) {
  if (!cart[index].qty) cart[index].qty = 1;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

// Remove um item do carrinho
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// ================= TOTAIS =================

// Calcula e exibe subtotal e total
function updateTotal() {
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * (item.qty || 1);
  });
  subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
  totalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
}

// ================= FINALIZAÇÃO =================

// Gera mensagem e abre WhatsApp com resumo do pedido
function finalizarPedido() {
  let message = "Pedido Flor do Sol 🌿\n\n";

  cart.forEach(item => {
    message += `• ${item.name} x${item.qty || 1} - R$ ${(item.price * (item.qty || 1)).toFixed(2)}\n`;
  });

  const total = cart.reduce((acc, item) => {
    return acc + item.price * (item.qty || 1);
  }, 0);

  message += `\nTotal: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// ================= INIT =================

renderCart();
