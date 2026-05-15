// ================= CARD DE PRODUTO COMPARTILHADO =================
// Função única para renderizar cards de produto no catálogo, home e favoritos.
// Elimina a duplicação de ~40 linhas de HTML que antes existia em 3 arquivos.
//
// Uso: renderProductCard(produto, opções)
//
// Opções disponíveis:
//   fadeIn            - Adiciona classe fade-in e cursor-pointer (usado no catálogo)
//   heartAction       - 'toggle' para alternar favorito | 'remove' para remover direto
//   heartAlwaysVisible- true para coração sempre visível (página de favoritos)
//   buttonText        - Texto do botão CTA (padrão: "Ver detalhes")
//   buttonOnClick     - JS do onclick do botão (padrão: abrirModalPorId)
//   extraClass        - Classe extra no div externo (ex: "favorito-card")
//   dataAttrs         - Atributos data-* extras (ex: data-favorito-id="...")

function renderProductCard(p, options = {}) {
  const {
    fadeIn = false,
    heartAction = 'toggle',
    heartAlwaysVisible = false,
    buttonText = 'Ver detalhes',
    buttonOnClick = `abrirModalPorId(${p.id})`,
    extraClass = '',
    dataAttrs = '',
  } = options;

  const nome = escapeHtml(p.nome);
  const badge = escapeHtml(p.badge || '');
  const categoria = escapeHtml(p.categoria);
  const imgSrc = escapeHtml(p.imagem);
  const isFav = window.isFavorito ? isFavorito(p.id) : false;

  const heartFilled = heartAction === 'remove' || isFav;
  const heartClasses = heartAlwaysVisible
    ? ''
    : `opacity-0 group-hover:opacity-100${isFav ? ' opacity-100' : ''}`;
  const heartOnClick = heartAction === 'remove'
    ? `removerFavorito(${p.id})`
    : `toggleFavoritoCard(${p.id}, this)`;

  return `
    <div ${dataAttrs} class="group bg-white rounded-xl shadow-sm overflow-hidden relative transition duration-300 hover:shadow-lg${fadeIn ? ' fade-in cursor-pointer' : ''}${extraClass ? ' ' + extraClass : ''}">
      ${p.badge ? `
        <span class="absolute m-3 px-2 py-1 text-xs text-white rounded z-10
          ${p.badge === 'Popular' ? 'bg-[#aea100]' : 'bg-[#1a2e1a]'}">
          ${badge}
        </span>
      ` : ''}
      <button onclick="${heartOnClick}"
              class="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-all duration-300 shadow-sm ${heartClasses}"
              aria-label="Favoritar">
        <svg class="w-5 h-5 ${heartFilled ? 'text-[#aea100]' : 'text-gray-400'}" fill="${heartFilled ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
      <div class="overflow-hidden cursor-pointer" onclick="abrirModalPorId(${p.id})">
        <img src="${imgSrc}" alt="${nome}" loading="lazy"
             class="aspect-[4/5] w-full object-cover group-hover:scale-105 transition duration-300">
      </div>
      <div class="p-4">
        <h3 class="font-medium">${nome}</h3>
        <p class="text-sm text-gray-400 capitalize">${categoria}</p>
        <p class="font-bold mt-1">R$ ${p.preco.toFixed(2)}</p>
        <div class="flex items-center gap-2 text-sm my-2">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Disponível
        </div>
        <button onclick="${buttonOnClick}"
                class="w-full bg-[#1a2e1a] text-white py-2 rounded-full mt-2 hover:opacity-90 transition">
          ${buttonText}
        </button>
      </div>
    </div>
  `;
}
