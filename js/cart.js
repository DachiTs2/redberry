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

// ------------------ CART OPEN/CLOSE ------------------
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

// ------------------ ADD TO CART ------------------
window.addToCart = function addToCart(product, selectedColor, selectedSize, quantity = 1) {
  cart.push({
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    cover_image: product.cover_image,
    color: selectedColor || "Not selected",
    size: selectedSize || "Not selected",
    qty: quantity
  });
  persist();
  render();
  openCart();
};

// ------------------ HELPERS ------------------
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

// ------------------ RENDER ------------------
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
        <div>
          <div class="rs-item__title">${it.name}</div>
          <div class="rs-item__meta">
            Color: ${it.color}<br>
            Size: ${it.size}<br>
            Quantity: ${it.qty}
          </div>
        </div>
        <div class="rs-item__right">
          <div class="rs-item__price">${money(it.price)}</div>
          <button class="rs-remove" data-i="${i}">Remove</button>
        </div>
      `;

      itemsEl.appendChild(row);
    });

    // attach remove listeners
    itemsEl.querySelectorAll(".rs-remove").forEach(btn => {
      btn.addEventListener("click", (e) => removeAt(Number(e.currentTarget.dataset.i)));
    });

    footerEl.style.display = "block";
  }

  // totals
  const subtotal = cart.reduce((s, it) => s + (Number(it.price) * (it.qty || 1)), 0);
  countEl.textContent = cart.length;
  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(subtotal + (cart.length ? deliveryFee : 0));
}

// ------------------ INIT ------------------
render();

