// ================= FAVORITOS (Minha Seleção) =================
// Gerencia a lista de produtos favoritos do usuário, persistindo
// via sessionStorage para que os dados durem apenas na aba atual.

const FAVORITOS_KEY = "flordosol-favoritos";

// ================= ESTADO =================
// Carrega a lista salva ou inicia vazia.

let favoritos = JSON.parse(sessionStorage.getItem(FAVORITOS_KEY)) || [];

// Persiste a lista atual no sessionStorage.
function salvarFavoritos() {
  sessionStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
}

// ================= ADICIONAR / REMOVER =================

// Adiciona um produto aos favoritos (ignora duplicatas pelo ID).
function adicionarFavorito(produto) {
  if (favoritos.some(f => f.id === produto.id)) return;
  favoritos.push({
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    imagem: produto.imagem,
    categoria: produto.categoria,
    badge: produto.badge,
    avaliacao: produto.avaliacao,
    reviews: produto.reviews,
    tamanho: produto.tamanho,
    embalagem: produto.embalagem,
  });
  salvarFavoritos();
  atualizarBadgeFavoritos();
  renderizarFavoritos();
}

// Remove um produto dos favoritos pelo ID.
// Aplica animação fade-out de 300ms no card antes de remover.
function removerFavorito(id) {
  const card = document.querySelector(`[data-favorito-id="${id}"]`);
  if (card) {
    card.classList.add("favorito-removing");
    setTimeout(() => {
      favoritos = favoritos.filter(f => f.id !== id);
      salvarFavoritos();
      atualizarBadgeFavoritos();
      renderizarFavoritos();
    }, 300);
  } else {
    favoritos = favoritos.filter(f => f.id !== id);
    salvarFavoritos();
    atualizarBadgeFavoritos();
    renderizarFavoritos();
  }
}

// Verifica se um produto (pelo ID) está nos favoritos.
function isFavorito(id) {
  return favoritos.some(f => f.id === id);
}

// ================= BADGE NA NAVBAR =================
// Atualiza o contador de favoritos no ícone de coração do navbar.
// Oculta o badge quando a lista está vazia.

function atualizarBadgeFavoritos() {
  const badge = document.getElementById("favoritos-count");
  if (badge) {
    badge.innerText = favoritos.length;
    badge.classList.toggle("hidden", favoritos.length === 0);
  }
}

// ================= RENDERIZAÇÃO =================
// Renderiza o grid de cards na página de favoritos.
// Mostra/esconde o estado vazio conforme a lista.

function renderizarFavoritos() {
  const grid = document.getElementById("favoritos-grid");
  const emptyState = document.getElementById("empty-state");
  if (!grid) return;

  const vazio = favoritos.length === 0;
  grid.classList.toggle("hidden", vazio);
  emptyState.classList.toggle("hidden", !vazio);

  if (vazio) {
    grid.innerHTML = "";
    return;
  }

  const info = document.getElementById("favoritos-count-info");
  if (info) {
    info.innerText = `${favoritos.length} ${favoritos.length === 1 ? "item" : "itens"}`;
  }

  grid.innerHTML = favoritos.map(p => renderProductCard(p, {
    heartAction: 'remove',
    heartAlwaysVisible: true,
    buttonText: 'Encomendar Agora',
    buttonOnClick: `comprarFavorito(${p.id})`,
    dataAttrs: `data-favorito-id="${p.id}"`,
    extraClass: 'favorito-card',
  })).join("");
}

// ================= WHATSAPP =================
// Abre WhatsApp com mensagem personalizada para o produto selecionado.

function comprarFavorito(id) {
  if (!getUser()) {
    showToast("Efetue o login para continuar a sua compra", "warning");
    return;
  }
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  const msg = `Olá! Tenho interesse em "${produto.nome}" (R$ ${produto.preco.toFixed(2)}) — vi no meu selecionados da Flor do Sol.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ================= TOGGLE (usado nos cards do catálogo/home) =================
// Alterna favorito sem re-renderizar o grid inteiro.
// Recebe o ID do produto e o botão clicado para manipular o SVG no DOM.

function toggleFavoritoCard(id, btn) {
  const isFav = isFavorito(id);
  if (isFav) {
    removerFavorito(id);
  } else {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      adicionarFavorito(produto);
      showToast(`${produto.nome} adicionado aos favoritos!`);
    }
  }

  // Atualiza visual do coração (preenchido/vazado) sem re-render.
  const svg = btn.querySelector("svg");
  if (svg) {
    if (isFav) {
      svg.setAttribute("fill", "none");
      svg.classList.remove("text-[#aea100]");
      svg.classList.add("text-gray-400");
      btn.classList.remove("opacity-100");
    } else {
      svg.setAttribute("fill", "currentColor");
      svg.classList.remove("text-gray-400");
      svg.classList.add("text-[#aea100]");
      btn.classList.add("opacity-100");
    }
  }
}

// ================= EXPOSIÇÃO GLOBAL =================
// Torna as funções acessíveis via onclick no HTML.

window.adicionarFavorito = adicionarFavorito;
window.removerFavorito = removerFavorito;
window.isFavorito = isFavorito;
window.comprarFavorito = comprarFavorito;
window.toggleFavoritoCard = toggleFavoritoCard;

// ================= INIT =================
// Renderiza a lista ao carregar a página e sincroniza o badge.

document.addEventListener("DOMContentLoaded", () => {
  renderizarFavoritos();
  atualizarBadgeFavoritos();
});
