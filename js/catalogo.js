// ================= DADOS =================
const produtos = [
  {nome:"Orquídea Branca", preco:89.9, categoria:"plantas", badge:"Popular"},
  {nome:"Samambaia Verde", preco:49.9, categoria:"plantas"},
  {nome:"Arranjo Luxo Rosas", preco:129.9, categoria:"arranjos", badge:"Popular"},
  {nome:"Suculenta Mini", preco:29.9, categoria:"plantas", badge:"Novidade"},
  {nome:"Cesta Presente", preco:159.9, categoria:"servicos"},
  {nome:"Buquê Especial", preco:99.9, categoria:"arranjos"},
];

// ================= ESTADO =================
let categoriaAtual = "todos";

// ================= ELEMENTOS =================
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const empty = document.getElementById("empty");

// ================= RENDER =================
function render(lista){
  if(lista.length === 0){
    empty.classList.remove("hidden");
    grid.innerHTML = "";
    return;
  }

  empty.classList.add("hidden");

  grid.innerHTML = lista.map(p => `
    <div class="fade-in group bg-white rounded-xl shadow-sm overflow-hidden relative transition duration-300">

      ${p.badge ? `
        <span class="absolute m-3 px-2 py-1 text-xs text-white rounded
          ${p.badge === 'Popular' ? 'bg-[#aea100]' : 'bg-[#1a2e1a]'}">
          ${p.badge}
        </span>
      ` : ""}

      <div class="overflow-hidden">
        <div class="aspect-[4/5] bg-gray-200 group-hover:scale-105 transition duration-300"></div>
      </div>

      <div class="p-4">
        <h3 class="font-medium">${p.nome}</h3>
        <p class="text-sm text-gray-400 capitalize">${p.categoria}</p>

        <p class="font-bold mt-1">R$ ${p.preco.toFixed(2)}</p>

        <div class="flex items-center gap-2 text-sm my-2">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Disponível
        </div>

        <button data-produto='${JSON.stringify(p)}'
          class="btn-add-cart w-full bg-[#1a2e1a] text-white py-2 rounded-full mt-2 hover:opacity-90 transition">
          Adicionar ao carrinho
        </button>

        <button onclick="comprar('${p.nome}', ${p.preco})"
          class="w-full border border-[#1a2e1a] text-[#1a2e1a] py-2 rounded-full mt-2 hover:bg-[#1a2e1a] hover:text-white transition">
          Comprar via WhatsApp
        </button>
      </div>

    </div>
  `).join("");

  // animação fade-in
  setTimeout(() => {
    document.querySelectorAll(".fade-in").forEach(el => {
      el.classList.add("show");
    });
  }, 50);
}

// ================= FILTROS =================
function aplicarFiltros(){
  let lista = [...produtos];

  // categoria
  if(categoriaAtual !== "todos"){
    lista = lista.filter(p => p.categoria === categoriaAtual);
  }

  // busca
  const termo = search.value.toLowerCase();
  lista = lista.filter(p => p.nome.toLowerCase().includes(termo));

  // ordenação
  if(sort.value === "menor"){
    lista.sort((a,b)=> a.preco - b.preco);
  }
  if(sort.value === "maior"){
    lista.sort((a,b)=> b.preco - a.preco);
  }

  render(lista);
}

// ================= EVENTOS =================
if(search){
  search.addEventListener("input", aplicarFiltros);
}

if(sort){
  sort.addEventListener("change", aplicarFiltros);
}

document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(b=>{
      b.classList.remove("active");
    });

    btn.classList.add("active");
    categoriaAtual = btn.dataset.cat;

    aplicarFiltros();
  });
});

// ================= WHATSAPP =================
function comprar(nome, preco){
  const msg = `Olá! Tenho interesse em "${nome}" no valor de R$ ${preco.toFixed(2)}.`;
  const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// ================= CARRINHO =================
function handleAddToCart(produto){
  addToCart({
    name: produto.nome,
    price: produto.preco
  });

  alert(`${produto.nome} foi adicionado ao carrinho 🛒`);
}

// ================= INIT =================

// pegar parâmetro da URL
const params = new URLSearchParams(window.location.search);
const catURL = params.get("cat");

// garantir que DOM já carregou tabs
window.addEventListener("DOMContentLoaded", () => {

  if(catURL){
    categoriaAtual = catURL;

    document.querySelectorAll(".tab").forEach(btn=>{
      btn.classList.remove("active");

      if(btn.dataset.cat === catURL){
        btn.classList.add("active");
      }
    });

    aplicarFiltros();
  } else {
    render(produtos);
  }

});

// ================= EVENT DELEGATION =================
document.addEventListener("click", function(e) {
  const btn = e.target.closest(".btn-add-cart");
  if (!btn) return;
  
  const produto = JSON.parse(btn.dataset.produto);
  handleAddToCart(produto);
});