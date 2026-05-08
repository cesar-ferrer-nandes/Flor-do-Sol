// ================= CONSTANTES =================

const WHATSAPP_NUMBER = "5511999999999";
const FRETE_GRATIS_LIMITE = 100;
const FRETE_VALOR_PADRAO = 15;

// ================= ESTADO (sessionStorage) =================

let carrinho = JSON.parse(sessionStorage.getItem("flordosol-cart")) || [];

function salvarCarrinho() {
  sessionStorage.setItem("flordosol-cart", JSON.stringify(carrinho));
}

// ================= ELEMENTOS DO DOM =================

const CartElements = {
  container: document.getElementById("cart-items"),
  subtotal: document.getElementById("subtotal"),
  total: document.getElementById("total"),
  frete: document.getElementById("frete"),
  info: document.getElementById("cart-info"),
  emptyState: document.getElementById("empty-state"),
  cartContainer: document.getElementById("cart-container"),
};

// ================= FORMATAR MOEDA =================

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ================= ADICIONAR AO CARRINHO =================

function adicionarAoCarrinho(produto) {
  const semPersonalizacao = !produto.personalizacao;
  const existente = semPersonalizacao
    ? carrinho.find(item => item.name === produto.name && !item.personalizacao)
    : null;

  if (existente) {
    existente.qty = (existente.qty || 1) + (produto.qty || 1);
  } else {
    carrinho.push({
      name: produto.name,
      price: produto.price,
      qty: produto.qty || 1,
      personalizacao: produto.personalizacao || null,
    });
  }

  salvarCarrinho();
  renderizarCarrinho();
}

// ================= REMOVER ITEM =================

function removerItem(indice) {
  carrinho.splice(indice, 1);
  salvarCarrinho();
  renderizarCarrinho();
}

// ================= ATUALIZAR QUANTIDADE =================

function atualizarQuantidade(indice, delta) {
  if (!carrinho[indice]) return;

  carrinho[indice].qty = (carrinho[indice].qty || 1) + delta;

  if (carrinho[indice].qty <= 0) {
    carrinho.splice(indice, 1);
  }

  salvarCarrinho();
  renderizarCarrinho();
}

// ================= CALCULAR FRETE =================

function calcularFrete(subtotal) {
  if (subtotal === 0) return 0;
  if (subtotal >= FRETE_GRATIS_LIMITE) return 0;
  return FRETE_VALOR_PADRAO;
}

// ================= ATUALIZAR SUBTOTAL / FRETE / TOTAL =================

function atualizarResumo() {
  const subtotal = carrinho.reduce((acc, item) => {
    return acc + item.price * (item.qty || 1);
  }, 0);

  const frete = calcularFrete(subtotal);
  const total = subtotal + frete;

  CartElements.subtotal.innerText = formatarMoeda(subtotal);
  CartElements.frete.innerText = frete === 0 ? "Grátis" : formatarMoeda(frete);
  CartElements.total.innerText = formatarMoeda(total);
}

// ================= RENDERIZAR CARRINHO =================

function renderizarCarrinho() {
  const vazio = carrinho.length === 0;

  CartElements.cartContainer.classList.toggle("hidden", vazio);
  CartElements.emptyState.classList.toggle("hidden", !vazio);

  const entregaSection = document.getElementById("entrega-section");
  if (entregaSection) entregaSection.classList.toggle("hidden", vazio);

  if (vazio) {
    CartElements.container.innerHTML = "";
    return;
  }

  CartElements.info.innerText = `${carrinho.length} ite${carrinho.length > 1 ? "ns" : "m"}`;

  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = carrinho.length;

  CartElements.container.innerHTML = carrinho.map((item, indice) => {
    const p = item.personalizacao;
    const temPersonalizacao = p && (p.embalagem || p.fita !== "Sem fita" || p.mensagem || p.observacoes);

    return `
    <div class="flex items-start gap-4 border-b pb-4">
      <div class="w-20 aspect-[4/5] bg-gray-200 rounded-lg shrink-0"></div>
      <div class="flex-1 min-w-0">
        <h3 class="font-medium">${item.name}</h3>
        <p class="text-sm text-gray-400">${formatarMoeda(item.price)}</p>

        ${temPersonalizacao ? `
        <div class="mt-2 space-y-1 text-xs text-gray-500">
          ${p.embalagem ? `<p>🎁 Embalagem: ${p.embalagem}</p>` : ""}
          ${p.fita && p.fita !== "Sem fita" ? `<p>🎀 Fita: ${p.fita}</p>` : ""}
          ${p.mensagem ? `<p>💬 "${p.mensagem}"</p>` : ""}
          ${p.observacoes ? `<p>📝 ${p.observacoes}</p>` : ""}
        </div>
        ` : ""}

        <div class="flex items-center gap-3 mt-2">
          <button onclick="atualizarQuantidade(${indice}, -1)"
                  class="w-7 h-7 flex items-center justify-center bg-[#1a2e1a] text-white rounded text-sm">-</button>
          <span class="text-sm font-medium">${item.qty || 1}</span>
          <button onclick="atualizarQuantidade(${indice}, 1)"
                  class="w-7 h-7 flex items-center justify-center bg-[#1a2e1a] text-white rounded text-sm">+</button>
        </div>
      </div>
      <button onclick="removerItem(${indice})" class="shrink-0 text-sm">🗑️</button>
    </div>
    `;
  }).join("");

  atualizarResumo();
}

// ================= FINALIZAR PEDIDO (WhatsApp) =================

function finalizarPedido() {
  if (carrinho.length === 0) return;

  const subtotal = carrinho.reduce((acc, item) => {
    return acc + item.price * (item.qty || 1);
  }, 0);

  const frete = calcularFrete(subtotal);
  const total = subtotal + frete;

  let mensagem = "Pedido Flor do Sol 🌿\n\n";

  carrinho.forEach(item => {
    const totalItem = item.price * (item.qty || 1);
    mensagem += `• ${item.name} x${item.qty || 1} - ${formatarMoeda(totalItem)}\n`;

    const p = item.personalizacao;
    if (p) {
      if (p.embalagem) mensagem += `  Embalagem: ${p.embalagem}\n`;
      if (p.fita && p.fita !== "Sem fita") mensagem += `  Fita: ${p.fita}\n`;
      if (p.mensagem) mensagem += `  Mensagem: "${p.mensagem}"\n`;
      if (p.observacoes) mensagem += `  Obs: ${p.observacoes}\n`;
    }
  });

  mensagem += `\nSubtotal: ${formatarMoeda(subtotal)}`;
  mensagem += `\nFrete: ${frete === 0 ? "Grátis" : formatarMoeda(frete)}`;
  mensagem += `\nTotal: ${formatarMoeda(total)}`;

  const entrega = JSON.parse(sessionStorage.getItem("flordosol-entrega"));
  if (entrega) {
    mensagem += `\n━━─━━───━━─━━\n`;
    mensagem += `📍 Endereço de Entrega\n`;
    mensagem += `Nome: ${entrega.nome}\n`;
    mensagem += `${entrega.rua}, ${entrega.numero}`;
    if (entrega.complemento) mensagem += ` - ${entrega.complemento}`;
    mensagem += `\n${entrega.bairro}, ${entrega.cidade}`;
    mensagem += `\nCEP: ${entrega.cep}`;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// ================= EXPOR FUNÇÕES GLOBAIS =================

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerItem = removerItem;
window.atualizarQuantidade = atualizarQuantidade;
window.finalizarPedido = finalizarPedido;

// ================= INIT =================

renderizarCarrinho();
