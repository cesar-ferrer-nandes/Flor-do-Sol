const app = document.getElementById("app");

let state = {
  produtos: [
    {id:1, nome:"Samambaia", preco:50, categoria:"plantas", popular:true, estoque:true},
    {id:2, nome:"Arranjo Luxo", preco:120, categoria:"arranjos", popular:true, estoque:true},
    {id:3, nome:"Orquídea", preco:90, categoria:"plantas", popular:false, estoque:false},
  ],
  favoritos: [],
  carrinho: []
};

// ================= ROUTER =================
function navigate(page) {
  if(page === "home") renderHome();
  if(page === "catalogo") renderCatalogo();
  if(page === "dicas") renderDicas();
  if(page === "favoritos") renderFavoritos();
  if(page === "carrinho") renderCarrinho();
}

// ================= HOME =================
function renderHome(){
  app.innerHTML = `
  <section class="h-[85vh] bg-[url('https://images.unsplash.com/photo-plant')] bg-cover flex items-center px-10 text-white">
    <div>
      <h1 class="text-5xl mb-4">Beleza natural para seu espaço</h1>
      <button onclick="navigate('catalogo')" class="bg-[#1a2e1a] px-6 py-3 rounded-lg mr-4">Ver catálogo</button>
      <button class="bg-[#aea100] px-6 py-3 rounded-lg">Serviços</button>
    </div>
  </section>

  <section class="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="card-hover p-6 bg-white shadow">Plantas</div>
    <div class="card-hover p-6 bg-white shadow">Arranjos</div>
    <div class="card-hover p-6 bg-white shadow">Serviços</div>
  </section>
  `;
}

// ================= CATÁLOGO =================
function renderCatalogo(){
  let produtosHTML = state.produtos.map(p => `
    <div class="group bg-white p-4 shadow card-hover">
      <div class="aspect-[4/5] bg-gray-200 mb-2"></div>
      <h3>${p.nome}</h3>
      <p class="font-bold">R$ ${p.preco}</p>
      <button onclick="addCarrinho(${p.id})" class="w-full bg-[#1a2e1a] text-white py-2 mt-2">Encomendar</button>
    </div>
  `).join("");

  app.innerHTML = `
    <section class="p-10">
      <h1 class="text-3xl mb-6">Nosso Jardim</h1>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        ${produtosHTML}
      </div>
    </section>
  `;
}

// ================= DICAS =================
function renderDicas(){
  app.innerHTML = `
  <section class="p-10 grid md:grid-cols-3 gap-6">
    <div class="bg-white p-4 shadow">
      <h3>Como cuidar da sua planta</h3>
      <p>Aprenda a manter sua planta saudável...</p>
    </div>
  </section>
  `;
}

// ================= FAVORITOS =================
function renderFavoritos(){
  let favs = state.produtos.filter(p => state.favoritos.includes(p.id));

  app.innerHTML = `
  <section class="p-10">
    <h1>Favoritos</h1>
    ${favs.map(p => `<p>${p.nome}</p>`).join("")}
  </section>
  `;
}

// ================= CARRINHO =================
function renderCarrinho(){

  let total = state.carrinho.reduce((acc,id)=>{
    let prod = state.produtos.find(p=>p.id===id);
    return acc + prod.preco;
  },0);

  app.innerHTML = `
  <section class="p-10">
    <h1>Meu Pedido</h1>

    ${state.carrinho.map(id=>{
      let p = state.produtos.find(x=>x.id===id);
      return `<div>${p.nome} - R$ ${p.preco}</div>`;
    }).join("")}

    <h2 class="mt-4 font-bold">Total: R$ ${total}</h2>

    <button onclick="finalizarPedido()" class="bg-green-600 text-white px-6 py-3 mt-4">
      Finalizar via WhatsApp
    </button>
  </section>
  `;
}

// ================= AÇÕES =================
function addCarrinho(id){
  state.carrinho.push(id);
  alert("Adicionado!");
}

function finalizarPedido(){
  let texto = "Pedido:%0A";

  state.carrinho.forEach(id=>{
    let p = state.produtos.find(x=>x.id===id);
    texto += `- ${p.nome} R$${p.preco}%0A`;
  });

  window.open(`https://wa.me/5511999999999?text=${texto}`);
}

// init
if (document.getElementById("app")) {
  navigate('home');
}