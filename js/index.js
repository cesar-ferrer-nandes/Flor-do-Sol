// ================= PRODUTOS POPULARES (HOME) =================

// Renderiza os 4 produtos em destaque na página inicial
// Usa o array global 'produtos' definido em catalogo.js (carregado antes)
function renderPopulares() {
  const grid = document.getElementById("populares-grid");
  if (!grid) return;

  // Seleciona produtos específicos por ID (mesma seleção do layout original)
  const ids = [1, 3, 5, 2];
  const items = ids.map(id => produtos.find(p => p.id === id)).filter(Boolean);

  grid.innerHTML = items.map(p => renderProductCard(p)).join("");
}

// Inicializa ao carregar a página (aguarda produtos carregados da API)
window.addEventListener("produtos-carregados", renderPopulares);
// Fallback: se produtos já estiverem carregados
if (typeof produtos !== 'undefined' && produtos.length > 0) {
  document.addEventListener("DOMContentLoaded", renderPopulares);
}
