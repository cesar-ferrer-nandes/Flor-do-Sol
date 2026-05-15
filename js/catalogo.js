// ================= DADOS DOS PRODUTOS =================
// Carregados da API com fallback para dados locais (offline).

const PRODUTOS_FALLBACK = [
  {id:1, nome:"Orquídea Branca", preco:89.9, categoria:"plantas", badge:"Popular", imagem:"assets/images/rox.jpeg", avaliacao:5, reviews:24, tamanho:"25x35cm", embalagem:"Vaso de Cerâmica",rega:"2x por semana", sol:"Meia sombra", umidade:"60%"},
  {id:2, nome:"Samambaia Verde", preco:49.9, categoria:"plantas", imagem:"assets/images/pal.jpeg", avaliacao:4, reviews:18, tamanho:"20x30cm", embalagem:"Vaso Plástico",rega:"3x por semana", sol:"Sombra parcial", umidade:"70%"},
  {id:3, nome:"Arranjo Luxo Rosas", preco:129.9, categoria:"arranjos", badge:"Popular", imagem:"assets/images/arranjos.jpeg", avaliacao:5, reviews:42, tamanho:"40x50cm", embalagem:"Papel Kraft Premium + Fita",rega:"Diariamente", sol:"Luz indireta", umidade:"65%"},
  {id:4, nome:"Suculenta Mini", preco:29.9, categoria:"plantas", badge:"Novidade", imagem:"assets/images/sub.jpeg", avaliacao:4, reviews:12, tamanho:"10x15cm", embalagem:"Vaso de Barro",rega:"1x por semana", sol:"Sol direto", umidade:"40%"},
  {id:5, nome:"Cesta Presente", preco:159.9, categoria:"servicos", imagem:"assets/images/arm.jpeg", avaliacao:5, reviews:31, tamanho:"45x35cm", embalagem:"Cesta de Vime + Laço",rega:"Conforme item", sol:"Luz filtrada", umidade:"60%"},
  {id:6, nome:"Buquê Especial", preco:99.9, categoria:"arranjos", imagem:"assets/images/floo.jpeg", avaliacao:5, reviews:28, tamanho:"35x45cm", embalagem:"Papel Seda + Celofane",rega:"Não aplicável", sol:"Luz indireta", umidade:"55%"},
  {id:7, nome:"Arranjo Flores do Campo", preco:69.9, categoria:"arranjos", badge:"Novidade", imagem:"assets/images/papoulas.jpg", avaliacao:4, reviews:15, tamanho:"30x40cm", embalagem:"Vaso de Vidro + Juta",rega:"Diariamente", sol:"Luz indireta", umidade:"60%"},
  {id:8, nome:"Manutenção de Jardins", preco:79.9, categoria:"servicos", imagem:"assets/images/serviços.jpeg", avaliacao:5, reviews:22, tamanho:"Área externa", embalagem:"Kit profissional",rega:"Incluso", sol:"Conforme necessidade", umidade:"—"},
  {id:9, nome:"Projeto Paisagístico", preco:149.9, categoria:"servicos", badge:"Popular", imagem:"assets/images/plantas.jpeg", avaliacao:5, reviews:35, tamanho:"Personalizado", embalagem:"Consultoria + Croqui",rega:"Orientação inclusa", sol:"Análise do local", umidade:"—"},
  {id:10, nome:"Lírio da Paz", preco:69.9, categoria:"plantas", badge:"Novidade", imagem:"assets/images/jardimSofisticado.png", avaliacao:4, reviews:20, tamanho:"30x40cm", embalagem:"Vaso de Cerâmica",rega:"2x por semana", sol:"Meia sombra", umidade:"65%"},
  {id:11, nome:"Vaso de Girassóis", preco:89.9, categoria:"arranjos", imagem:"assets/images/rega.png", avaliacao:4, reviews:17, tamanho:"35x45cm", embalagem:"Vaso Decorado + Fita",rega:"Diariamente", sol:"Sol direto", umidade:"50%"},
  {id:12, nome:"Kit Terrário", preco:59.9, categoria:"servicos", badge:"Novidade", imagem:"assets/images/Cuidarplanta.png", avaliacao:4, reviews:14, tamanho:"20x20cm", embalagem:"Vidro + Kit montagem",rega:"1x por semana", sol:"Luz indireta", umidade:"70%"},
];

let produtos = [];

async function carregarProdutos() {
  try {
    const res = await fetch('api/produtos.php?_=' + Date.now());
    if (res.ok) {
      produtos = await res.json();
      return;
    }
  } catch (e) {}
  produtos = [...PRODUTOS_FALLBACK];
}

// ================= CONFIGURAÇÃO DE PERSONALIZAÇÃO =================
// Opções disponíveis no modal: embalagem (simples/premium), tipo de vaso (plástico/barro),
// urso de pelúcia (sim/não) e cores de fita.

const OPCOES_EMBALAGEM = {
  simples: { nome: "Embalagem Simples", adicional: 0 },
  premium: { nome: "Embalagem Premium", adicional: 20 },
};

const OPCOES_VASO = [
  { valor: "plastico", nome: "Vaso de Plástico", adicional: 0 },
  { valor: "barro", nome: "Vaso de Barro", adicional: 20 },
];

const OPCOES_FITA = [
  { valor: "sem", nome: "Sem fita", adicional: 0 },
  { valor: "vermelha", nome: "Vermelha", adicional: 5 },
  { valor: "dourada", nome: "Dourada", adicional: 5 },
  { valor: "prateada", nome: "Prateada", adicional: 5 },
  { valor: "verde", nome: "Verde", adicional: 5 },
  { valor: "azul", nome: "Azul", adicional: 5 },
];

// ================= ESTADO =================
// Controla qual categoria está selecionada nos filtros.

let categoriaAtual = "todos";

// ================= ELEMENTOS DO DOM =================

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const empty = document.getElementById("empty");

// ================= RENDERIZAÇÃO DO GRID =================
// Converte a lista de produtos em HTML com cards.
// Cada card tem: badge, imagem com hover zoom, nome, categoria, preço,
// indicador de disponibilidade e botão "Ver detalhes".

function render(lista) {
  if (!grid) return;

  if (lista.length === 0) {
    empty.classList.remove("hidden");
    grid.innerHTML = "";
    return;
  }

  empty.classList.add("hidden");

  grid.innerHTML = lista.map(p => renderProductCard(p, {
    fadeIn: true,
  })).join("");

  // Animação fade-in para novos cards.
  setTimeout(() => {
    document.querySelectorAll(".fade-in").forEach(el => el.classList.add("show"));
  }, 50);
}

// ================= FILTROS =================
// Aplica filtro por categoria, busca textual e ordenação por preço.

function aplicarFiltros() {
  let lista = [...produtos];

  if (categoriaAtual !== "todos") {
    lista = lista.filter(p => p.categoria === categoriaAtual);
  }

  const termo = search.value.toLowerCase();
  lista = lista.filter(p => p.nome.toLowerCase().includes(termo));

  if (sort.value === "menor") {
    lista.sort((a, b) => a.preco - b.preco);
  } else if (sort.value === "maior") {
    lista.sort((a, b) => b.preco - a.preco);
  }

  render(lista);
}

// ================= EVENTOS DOS FILTROS =================

if (search) {
  search.addEventListener("input", aplicarFiltros);
}

if (sort) {
  sort.addEventListener("change", aplicarFiltros);
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    categoriaAtual = btn.dataset.cat;
    aplicarFiltros();
  });
});

// ================= MODAL DE PRODUTO =================
// Estado do modal: referências ao DOM, produto atual e quantidade.

const modal = document.getElementById("modal-produto");
const modalBody = document.getElementById("modal-body");
let produtoAtual = null;
let quantidadeModal = 1;

// ================= FUNÇÕES DE PERSONALIZAÇÃO =================
// Lê as opções selecionadas (embalagem, fita, mensagem, observações)
// e calcula o acréscimo no preço.

function obterDadosPersonalizacao() {
  const embalagem = document.querySelector('input[name="embalagem"]:checked');
  const vaso = document.querySelector('input[name="vaso"]:checked');
  const fita = document.querySelector('input[name="fita"]:checked');
  const ursoRadio = document.querySelector('input[name="urso"]:checked'); // "sim" ou "nao"
  const mensagem = document.getElementById("mensagem-cartao")?.value || "";
  const observacoes = document.getElementById("observacoes")?.value || "";

  return {
    embalagem: embalagem ? embalagem.value : "simples",
    vaso: vaso ? vaso.value : "plastico",
    fita: fita ? fita.value : "sem",
    ursoPelucia: ursoRadio ? ursoRadio.value === "sim" : false, // true = +R$ 50,00
    mensagem,
    observacoes,
  };
}

function calcularAdicionais() {
  const dados = obterDadosPersonalizacao();
  let adicional = 0;

  if (dados.embalagem && OPCOES_EMBALAGEM[dados.embalagem]) {
    adicional += OPCOES_EMBALAGEM[dados.embalagem].adicional;
  }

  const fitaOpcao = OPCOES_FITA.find(f => f.valor === dados.fita);
  if (fitaOpcao) {
    adicional += fitaOpcao.adicional;
  }

  const vasoOpcao = OPCOES_VASO.find(v => v.valor === dados.vaso);
  if (vasoOpcao) {
    adicional += vasoOpcao.adicional;
  }

  if (dados.ursoPelucia) { // Urso de Pelúcia: +R$ 50,00
    adicional += 50;
  }

  return adicional;
}

function atualizarPersonalizacao() {
  if (!produtoAtual) return;

  const adicional = calcularAdicionais();
  const total = (produtoAtual.preco + adicional) * quantidadeModal;
  const el = document.getElementById("preco-total-modal");
  if (el) {
    el.innerText = `R$ ${total.toFixed(2)}`;
  }
}

// ================= ABRIR MODAL =================
// Busca o produto pelo ID, preenche o modal com dados completos:
// imagem, nome, avaliação, preço, especificações, personalização,
// cuidados, quantidade, e botões de ação.

function abrirModalPorId(id) {
  produtoAtual = null;
  quantidadeModal = 1;

  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  produtoAtual = produto;

  modal.classList.remove("hidden");

  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.classList.remove("modal-exit", "modal-enter");
  }

  modalBody.innerHTML = "";

  const imagemUrl = produto.imagem;

  const opcoesFitaHTML = OPCOES_FITA.map(f => `
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="fita" value="${f.valor}" ${f.valor === "sem" ? "checked" : ""}
             onchange="atualizarPersonalizacao()"
             class="accent-[#1a2e1a]">
      <span class="text-sm">${f.nome}</span>
    </label>
  `).join("");

  const nomeProd = escapeHtml(produto.nome);
  const badgeProd = escapeHtml(produto.badge || '');
  const categoriaProd = escapeHtml(produto.categoria);
  const imgEsc = escapeHtml(imagemUrl);
  const tamanhoProd = escapeHtml(produto.tamanho);
  const regaProd = escapeHtml(produto.rega);
  const solProd = escapeHtml(produto.sol);
  const umidadeProd = escapeHtml(produto.umidade);

  modalBody.innerHTML = `
    <div class="relative">
      <div class="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative group">
        <img src="${imgEsc}" alt="${nomeProd}" loading="lazy"
             class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
      </div>
      ${produto.badge ? `
        <span class="absolute top-4 left-4 px-3 py-1 text-sm text-white rounded-full
          ${produto.badge === 'Popular' ? 'bg-[#aea100]' : 'bg-[#1a2e1a]'}">
          ${badgeProd}
        </span>
      ` : ''}
    </div>

    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-3xl lg:text-4xl font-playfair text-[#1a2e1a] mb-2">${nomeProd}</h1>
        <div class="flex items-center gap-2">
          <div class="flex text-[#aea100]">
            ${Array(5).fill(0).map((_, i) => `
              <svg class="w-5 h-5 ${i < produto.avaliacao ? 'text-[#aea100]' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            `).join('')}
          </div>
          <span class="text-sm text-gray-500">(${produto.reviews} reviews)</span>
        </div>
      </div>

      <div>
        <p class="text-4xl font-bold text-[#1a2e1a]">R$ ${produto.preco.toFixed(2)}</p>
        <div class="flex gap-2 mt-3">
          <span class="px-3 py-1 text-sm border border-[#1a2e1a] rounded-full capitalize">${categoriaProd}</span>
          <span class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center gap-1">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            Disponível
          </span>
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl p-5">
        <h3 class="font-medium mb-4 text-[#1a2e1a]">Especificações</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded-lg shadow-sm">
              <svg class="w-5 h-5 text-[#1a2e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tamanho</p>
              <p class="font-medium">${tamanhoProd}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded-lg shadow-sm">
              <svg class="w-5 h-5 text-[#1a2e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h10M12 8a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">Embalagem</p>
              <p class="font-medium">Embalagem Simples</p>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-gray-200 rounded-xl p-5">
        <h3 class="font-medium mb-4 text-[#1a2e1a]">Personalização</h3>

        <!-- Embalagem: Simples (grátis) ou Premium (+R$ 20,00) -->
        <div class="mb-4">
          <label class="flex items-center gap-2 cursor-pointer mb-2">
            <input type="radio" name="embalagem" value="simples" checked
                   onchange="atualizarPersonalizacao()" class="accent-[#1a2e1a]">
            <span class="text-sm">Embalagem Simples</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer mb-2">
            <input type="radio" name="embalagem" value="premium"
                   onchange="atualizarPersonalizacao()" class="accent-[#1a2e1a]">
            <span class="text-sm">Embalagem Premium +R$ 20,00</span>
          </label>
        </div>

        <!-- Vaso: Plástico (grátis) ou Barro (+R$ 20,00) -->
        <div class="mb-4">
          <p class="text-sm font-medium mb-2">Tipo de Vaso</p>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="vaso" value="plastico" checked
                     onchange="atualizarPersonalizacao()" class="accent-[#1a2e1a]">
              <span class="text-sm">Vaso de Plástico</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="vaso" value="barro"
                     onchange="atualizarPersonalizacao()" class="accent-[#1a2e1a]">
              <span class="text-sm">Vaso de Barro +R$ 20,00</span>
            </label>
          </div>
        </div>

        <!-- Urso de Pelúcia: opção adicional +R$ 50,00 -->
        <div class="mb-4">
          <p class="text-sm font-medium mb-2">Urso de Pelúcia</p>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="urso" value="nao" checked
                     onchange="atualizarPersonalizacao()" class="accent-[#1a2e1a]">
              <span class="text-sm">Sem Urso de Pelúcia</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="urso" value="sim"
                     onchange="atualizarPersonalizacao()" class="accent-[#1a2e1a]">
              <span class="text-sm">Adicionar Urso de Pelúcia 🧸 +R$ 50,00</span>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <p class="text-sm font-medium mb-2">Cor da Fita <span class="text-xs text-gray-400 font-normal">(+R$ 5,00)</span></p>
          <div class="grid grid-cols-3 gap-2">
            ${opcoesFitaHTML}
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Mensagem para Cartão</label>
          <textarea id="mensagem-cartao"
                    placeholder="Escreva uma mensagem especial..."
                    class="w-full border border-gray-200 rounded-xl p-4 h-20 resize-none focus:border-[#1a2e1a] focus:ring-1 focus:ring-[#1a2e1a] outline-none transition duration-300"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Observações Adicionais</label>
          <textarea id="observacoes"
                    placeholder="Ex: Prefiro entrega em horário comercial, indicar presente..."
                    class="w-full border border-gray-200 rounded-xl p-4 h-16 resize-none focus:border-[#1a2e1a] focus:ring-1 focus:ring-[#1a2e1a] outline-none transition duration-300"></textarea>
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl p-5">
        <h3 class="font-medium mb-4 text-[#1a2e1a] flex items-center gap-2">
          <svg class="w-5 h-5 text-[#aea100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          Dicas de Cuidados
        </h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <svg class="w-5 h-5 mx-auto mb-1 text-[#1a2e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
            </svg>
            <p class="text-xs text-gray-500">Rega</p>
            <p class="text-sm font-medium">${regaProd}</p>
          </div>
          <div>
            <svg class="w-5 h-5 mx-auto mb-1 text-[#1a2e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <p class="text-xs text-gray-500">Sol</p>
            <p class="text-sm font-medium">${solProd}</p>
          </div>
          <div>
            <svg class="w-5 h-5 mx-auto mb-1 text-[#1a2e1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
            <p class="text-xs text-gray-500">Umidade</p>
            <p class="text-sm font-medium">${umidadeProd}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-[#1a2e1a]">Quantidade:</span>
        <div class="flex items-center border border-[#1a2e1a] rounded-full">
          <button onclick="alterarQuantidadeModal(-1)" class="px-4 py-2 hover:bg-gray-100 rounded-l-full transition duration-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
          </button>
          <span id="qtd-modal" class="px-4 py-2 font-semibold min-w-[40px] text-center text-[#1a2e1a]">1</span>
          <button onclick="alterarQuantidadeModal(1)" class="px-4 py-2 hover:bg-gray-100 rounded-r-full transition duration-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2">
        <span class="text-sm text-gray-500">Valor total:</span>
        <span id="preco-total-modal" class="text-2xl font-bold text-[#1a2e1a]">R$ ${produto.preco.toFixed(2)}</span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button onclick="adicionarAoCarrinhoModal()"
                class="flex-1 border-2 border-[#1a2e1a] text-[#1a2e1a] px-6 py-4 rounded-full font-medium hover:bg-[#1a2e1a] hover:text-white transition duration-300">
          Adicionar à Sacola
        </button>
        <button onclick="comprarViaWhatsAppModal()"
                class="flex-1 bg-[#1a2e1a] text-white px-6 py-4 rounded-full font-medium hover:opacity-90 transition duration-300">
          Comprar via WhatsApp
        </button>
      </div>
    </div>
  `;

  if (modalContent) {
    modalContent.classList.add("modal-enter");
  }

  modalBody.className = "grid lg:grid-cols-2 gap-12 p-8";

  if (document.getElementById("qtd-modal")) {
    document.getElementById("qtd-modal").textContent = quantidadeModal;
  }

  atualizarPersonalizacao();
  document.body.style.overflow = "hidden";
}

// ================= QUANTIDADE =================
// Ajusta a quantidade no modal (mínimo 1) e atualiza o preço total.

function alterarQuantidadeModal(delta) {
  quantidadeModal = Math.max(1, quantidadeModal + delta);
  document.getElementById("qtd-modal").textContent = quantidadeModal;
  atualizarPersonalizacao();
}

// ================= ADICIONAR AO CARRINHO (via modal) =================
// Captura personalização, calcula preço final e salva no carrinho global.

function adicionarAoCarrinhoModal() {
  if (!produtoAtual) return;

  const personalizacao = obterDadosPersonalizacao();
  const adicional = calcularAdicionais();
  const precoFinal = produtoAtual.preco + adicional;

  const optEmbalagem = OPCOES_EMBALAGEM[personalizacao.embalagem];
  addToCart({
    name: produtoAtual.nome,
    price: precoFinal,
    qty: quantidadeModal,
    imagem: produtoAtual.imagem,
    personalizacao: {
      embalagem: optEmbalagem ? optEmbalagem.nome : "Embalagem Simples",
      ursoPelucia: personalizacao.ursoPelucia ? "Sim" : false, // Urso de Pelúcia
      vaso: OPCOES_VASO.find(v => v.valor === personalizacao.vaso)?.nome || "Vaso de Plástico",
      fita: OPCOES_FITA.find(f => f.valor === personalizacao.fita)?.nome || "Sem fita",
      mensagem: personalizacao.mensagem,
      observacoes: personalizacao.observacoes,
    },
  });

  showToast(`${quantidadeModal}x ${produtoAtual.nome} adicionado(s) ao carrinho!`);
  fecharModal();
}

// ================= COMPRAR VIA WHATSAPP (via modal) =================
// Monta mensagem com todos os detalhes (incluindo personalização)
// e abre WhatsApp diretamente.

function comprarViaWhatsAppModal() {
  if (!produtoAtual) return;
  if (!getUser()) {
    showToast("Efetue o login para continuar a sua compra", "warning");
    return;
  }

  const personalizacao = obterDadosPersonalizacao();
  const adicional = calcularAdicionais();
  const precoFinal = produtoAtual.preco + adicional;
  const total = precoFinal * quantidadeModal;

  let texto = `*Novo Pedido - Flor do Sol*%0A%0A`;
  texto += `📦 Produto: ${produtoAtual.nome}%0A`;
  texto += `💰 Preço Unitário: R$ ${precoFinal.toFixed(2)}%0A`;
  texto += `🔢 Quantidade: ${quantidadeModal}%0A`;
  texto += `📏 Tamanho: ${produtoAtual.tamanho}%0A`;

  const optEmbalagem = OPCOES_EMBALAGEM[personalizacao.embalagem];
  const nomeEmbalagem = optEmbalagem ? optEmbalagem.nome : "Embalagem Simples";
  texto += `🎁 Embalagem: ${nomeEmbalagem}%0A`;
  texto += `🏺 Vaso: ${OPCOES_VASO.find(v => v.valor === personalizacao.vaso)?.nome || "Vaso de Plástico"}%0A`;
  texto += `🎀 Fita: ${OPCOES_FITA.find(f => f.valor === personalizacao.fita)?.nome || "Sem fita"}%0A`;
  texto += `🧸 Urso de Pelúcia: ${personalizacao.ursoPelucia ? 'Sim' : 'Não'}%0A`; // +R$ 50,00 se Sim

  if (personalizacao.mensagem) {
    texto += `%0A💬 Mensagem: "${personalizacao.mensagem}"`;
  }
  if (personalizacao.observacoes) {
    texto += `%0A📝 Obs: "${personalizacao.observacoes}"`;
  }

  texto += `%0A%0A💵 Total: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

// ================= FECHAR MODAL =================
// Fecha com animação e restaura o scroll da página.

function fecharModal() {
  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.classList.remove("modal-enter");
    modalContent.classList.add("modal-exit");
    setTimeout(() => {
      modal.classList.add("hidden");
      modalContent.classList.remove("modal-exit");
    }, 250);
  } else {
    modal.classList.add("hidden");
  }
  document.body.style.overflow = "";
  produtoAtual = null;
}

function abrirModal(produto) {
  if (produto && produto.id) {
    abrirModalPorId(produto.id);
  }
}

// ================= EXPOSIÇÃO GLOBAL =================
// Torna funções do modal acessíveis via onclick no HTML.

window.abrirModalPorId = abrirModalPorId;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.alterarQuantidadeModal = alterarQuantidadeModal;
window.adicionarAoCarrinhoModal = adicionarAoCarrinhoModal;
window.comprarViaWhatsAppModal = comprarViaWhatsAppModal;
window.atualizarPersonalizacao = atualizarPersonalizacao;

// ================= ADICIONAR AO CARRINHO (via JS) =================
// Função auxiliar para adicionar direto sem modal (usada na home).

function handleAddToCart(produto) {
  addToCart({
    name: produto.nome,
    price: produto.preco,
    imagem: produto.imagem,
  });
  showToast(`${produto.nome} adicionado ao carrinho!`);
}

// ================= INIT =================
// Lê parâmetro ?cat= da URL e renderiza produtos correspondentes.

const params = new URLSearchParams(window.location.search);
const catURL = params.get("cat");

window.addEventListener("DOMContentLoaded", async () => {
  await carregarProdutos();

  // Dispara evento para informar index.js etc.
  window.dispatchEvent(new CustomEvent('produtos-carregados', { detail: produtos }));

  if (catURL) {
    categoriaAtual = catURL;
    document.querySelectorAll(".tab").forEach(btn => {
      btn.classList.remove("active");
      if (btn.dataset.cat === catURL) {
        btn.classList.add("active");
      }
    });
    aplicarFiltros();
  } else {
    render(produtos);
  }
});
