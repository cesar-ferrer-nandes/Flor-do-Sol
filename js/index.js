// ================= DADOS =================
const produtosPopulares = [
  {id:1, nome:"Orquídea Branca", preco:89.9, categoria:"plantas", badge:"Popular", imagem:"assets/images/rox.jpeg"},
  {id:3, nome:"Arranjo Luxo Rosas", preco:129.9, categoria:"arranjos", badge:"Popular", imagem:"assets/images/arranjos.jpeg"},
  {id:5, nome:"Cesta Presente", preco:159.9, categoria:"servicos", badge:"Especial", imagem:"assets/images/arm.jpeg"},
  {id:2, nome:"Samambaia Verde", preco:49.9, categoria:"plantas", imagem:"assets/images/pal.jpeg"},
];

// ================= RENDER =================
function renderPopulares() {
  const grid = document.getElementById("populares-grid");
  if (!grid) return;

  grid.innerHTML = produtosPopulares.map(p => `
    <div class="bg-white shadow rounded-xl p-4 relative transition duration-300 hover:shadow-lg">
      ${p.badge ? `
        <span class="absolute top-3 left-3 px-2 py-1 text-xs text-white rounded
          ${p.badge === 'Popular' ? 'bg-[#aea100]' : 'bg-[#1a2e1a]'}">
          ${p.badge}
        </span>
      ` : ""}

      <img src="${p.imagem}" alt="${p.nome}" class="aspect-[4/5] w-full object-cover rounded-lg mb-4">

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

// ================= INIT =================
document.addEventListener("DOMContentLoaded", renderPopulares);

// Expor função global
window.abrirModalPorId = window.abrirModalPorId || function(id) {
  const produto = produtosPopulares.find(p => p.id === id);
  if (!produto) return;
  alert(`Produto: ${produto.nome}\nPreço: R$ ${produto.preco.toFixed(2)}\n\nEm breve: página de detalhes!`);
};