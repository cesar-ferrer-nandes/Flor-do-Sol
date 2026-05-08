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
    <div class="bg-white shadow rounded-xl p-4 relative transition duration-300 hover:shadow-lg">
      ${p.badge ? `
        <span class="absolute top-3 left-3 px-2 py-1 text-xs text-white rounded
          ${p.badge === 'Popular' ? 'bg-[#aea100]' : 'bg-[#1a2e1a]'}">
          ${p.badge}
        </span>
      ` : ""}

      <img src="${p.imagem}" alt="${p.nome}" loading="lazy"
           class="aspect-[4/5] w-full object-cover rounded-lg mb-4">

      <h3 class="font-bold">${p.nome}</h3>
      <p class="text-[#1a2e1a] font-semibold">R$ ${p.preco.toFixed(2)}</p>

      <div class="flex items-center gap-2 text-sm mb-3">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
        Disponível
      </div>

      <button onclick="abrirModalPorId(${p.id})"
              class="w-full bg-[#1a2e1a] text-white py-2 rounded hover:opacity-90 transition">
        Ver detalhes
      </button>
    </div>
  `).join("");
}

// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", renderPopulares);
