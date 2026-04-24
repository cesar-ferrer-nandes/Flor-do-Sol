let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const existing = cart.find(p => p.name === product.name);

  if(existing){
    existing.qty = (existing.qty || 1) + (product.qty || 1);
  } else {
    product.qty = product.qty || 1;
    cart.push(product);
  }

  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const count = document.getElementById("cart-count");
  if (count) {
    count.innerText = cart.length;
  }
}

document.addEventListener("DOMContentLoaded", updateCartUI);