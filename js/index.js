// ================= PRODUTOS POPULARES (HOME) =================

// Renderiza os 4 produtos em destaque na página inicial
// Usa o array global 'produtos' definido em catalogo.js (carregado antes)
function renderPopulares() {
  const grid = document.getElementById("populares-grid");
  if (!grid) return;

  // Seleciona produtos específicos por ID (mesma seleção do layout original)
  const ids = [1, 3, 5, 2];
  const items = ids.map(id => produtos.find(p => p.id === id)).filter(Boolean);

  grid.innerHTML = items.map(p => `
    <div class="group bg-white rounded-xl shadow-sm overflow-hidden relative transition duration-300 hover:shadow-lg">

      ${p.badge ? `
        <span class="absolute m-3 px-2 py-1 text-xs text-white rounded z-10
          ${p.badge === 'Popular' ? 'bg-[#aea100]' : 'bg-[#1a2e1a]'}">
          ${p.badge}
        </span>
      ` : ""}

      <!-- Botão de coração: aparece ao hover, alterna favorito sem re-render -->
      <button onclick="toggleFavoritoCard(${p.id}, this)"
              class="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 ${isFavorito(p.id) ? 'opacity-100' : ''}"
              aria-label="Adicionar aos favoritos">
        <svg class="w-5 h-5 ${isFavorito(p.id) ? 'text-[#aea100]' : 'text-gray-400'}" fill="${isFavorito(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      <div class="overflow-hidden cursor-pointer" onclick="abrirModalPorId(${p.id})">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy"
             class="aspect-[4/5] w-full object-cover group-hover:scale-105 transition duration-300">
      </div>

      <div class="p-4">
        <h3 class="font-medium">${p.nome}</h3>
        <p class="text-sm text-gray-400 capitalize">${p.categoria}</p>
        <p class="font-bold mt-1">R$ ${p.preco.toFixed(2)}</p>

        <div class="flex items-center gap-2 text-sm my-2">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Disponível
        </div>

        <button onclick="abrirModalPorId(${p.id})"
                class="w-full bg-[#1a2e1a] text-white py-2 rounded-full mt-2 hover:opacity-90 transition">
          Ver detalhes
        </button>
      </div>
    </div>
  `).join("");
}

// Inicializa ao carregar a página (aguarda produtos carregados da API)
window.addEventListener("produtos-carregados", renderPopulares);
// Fallback: se produtos já estiverem carregados
if (typeof produtos !== 'undefined' && produtos.length > 0) {
  document.addEventListener("DOMContentLoaded", renderPopulares);
}
