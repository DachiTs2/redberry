// js/cart.js

const drawer     = document.getElementById("rs-cart");
const backdrop   = document.getElementById("rs-backdrop");
const closeBtn   = document.getElementById("rs-cart-close");
const itemsEl    = document.getElementById("rs-cart-items");
const countEl    = document.getElementById("rs-cart-count");
const subtotalEl = document.getElementById("rs-subtotal");
const totalEl    = document.getElementById("rs-total");
const footerEl   = document.querySelector(".rs-cart__footer");

const deliveryFee = 5;
let cart = JSON.parse(localStorage.getItem("rs_cart") || "[]");

function openCart() {
  drawer.classList.add("open");
  backdrop.classList.add("open");
}
function closeCart() {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
}

document.querySelectorAll(".icon-btn").forEach(btn => btn.addEventListener("click", openCart));
closeBtn.addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

window.addToCart = function addToCart(product, selectedColor, selectedSize, quantity = 1, imageToUse) {
  cart.push({
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    cover_image: imageToUse || product.cover_image, 
    color: selectedColor || "Not selected",         
    size: selectedSize || "Not selected",
    qty: quantity
  });
  persist();
  render();
  openCart();
};


function removeAt(index) {
  cart.splice(index, 1); 
  persist();
  render();
}

function persist() {
  localStorage.setItem("rs_cart", JSON.stringify(cart));
}

function money(n) {
  return `$${(Number(n) || 0).toFixed(2)}`;
}

function render() {
  itemsEl.innerHTML = "";

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="rs-cart-empty">
         <div class="cart-iicon">
      <img src="assets/groupcart.png" alt="Cart Outline" class="cart-outline">
      <img src="assets/groupcart2.png" alt="Cart Pattern" class="cart-fill">
    </div>
        <div><strong>Ooops!</strong></div>
        <div>You've got nothing in your cart just yet…</div>
        <button id="start-shopping">Start shopping</button>
      </div>`;
    footerEl.style.display = "none";

    const btn = document.getElementById("start-shopping");
    if (btn) btn.addEventListener("click", () => { 
      closeCart(); 
      window.location.href = "main.html"; 
    });
  } else {
    cart.forEach((it, i) => {
      if (!it.qty) it.qty = 1;

      const row = document.createElement("div");
      row.className = "rs-item";
      row.innerHTML = `
  <img src="${it.cover_image}" alt="">
  <div class="rs-item__info">
    <div class="rs-item__title">${it.name}</div>
    <div class="rs-item__meta">
      Color: ${it.color}<br>
      Size: ${it.size}
    </div>
    <div class="rs-item__qty-row">
  <div class="rs-item__qty-row">
  <div class="rs-item__qty">
    <button class="rs-qty" data-action="dec" data-i="${i}">−</button>
    <span>${it.qty}</span>
    <button class="rs-qty" data-action="inc" data-i="${i}">+</button>
  </div>
  <button class="rs-remove" data-i="${i}">Remove</button>
</div>
  
</div>
  </div>
  <div class="rs-item__side">
    <div class="rs-item__price">${money(it.price * it.qty)}</div>
  </div>
`;

      itemsEl.appendChild(row);
    });

itemsEl.querySelectorAll(".rs-qty").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const i = Number(e.currentTarget.dataset.i);
    const action = e.currentTarget.dataset.action;
    if (action === "inc") cart[i].qty++;
    if (action === "dec" && cart[i].qty > 1) cart[i].qty--;
    persist();
    render();
  });
});
    
    itemsEl.querySelectorAll(".rs-remove").forEach(btn => {
      btn.addEventListener("click", (e) => removeAt(Number(e.currentTarget.dataset.i)));
    });

    footerEl.style.display = "block";
  }

  const subtotal = cart.reduce((s, it) => s + (Number(it.price) * (it.qty || 1)), 0);
  countEl.textContent = cart.length;
  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(subtotal + (cart.length ? deliveryFee : 0));
}

const checkoutBtn = document.getElementById("rs-checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html"; 
  });
}


render();

