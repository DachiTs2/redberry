// js/checkout.js

// Elements
const checkoutItemsEl = document.getElementById("summary-items");
const subtotalEl = document.getElementById("sum-subtotal");
const deliveryEl = document.getElementById("sum-delivery"); 
const totalEl = document.getElementById("sum-total");
const payBtn = document.getElementById("btn-pay");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("rs_cart") || "[]");

// Delivery fee (same as cart.js)
const deliveryFee = 5;

// Render checkout summary
function renderCheckout() {
  if (!cart || cart.length === 0) {
    checkoutItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "$0";
    totalEl.textContent = "$0";
    return;
  }

  checkoutItemsEl.innerHTML = "";

  cart.forEach((it, i) => {
    const row = document.createElement("div");
    row.className = "checkout-item";

    row.innerHTML = `
      <img src="${it.cover_image}" alt="${it.name}">
      <div class="checkout-info">
        <div class="checkout-title">${it.name}</div>
        <div class="checkout-meta">
          Color: ${it.color} <br>
          Size: ${it.size} <br>
          Qty: ${it.qty}
        </div>
      </div>
      <div class="checkout-side">
        <div class="checkout-price">$${(it.price * it.qty).toFixed(2)}</div>
        <button class="checkout-remove" data-i="${i}">Remove</button>
      </div>
    `;
    checkoutItemsEl.appendChild(row);
  });

  // Totals
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  deliveryEl.textContent = `$${deliveryFee.toFixed(2)}`;
  totalEl.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;

  // Remove listeners
  checkoutItemsEl.querySelectorAll(".checkout-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.dataset.i);
      cart.splice(i, 1);
      localStorage.setItem("rs_cart", JSON.stringify(cart));
      renderCheckout();
    });
  });
}

// Init
renderCheckout();

// -------- Validation & Pay --------
const checkoutForm = document.getElementById("checkout-form");
const emailInput = document.getElementById("checkout-email");

// ✅ Pre-fill email if user exists
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
if (storedUser?.email && emailInput) {
  emailInput.value = storedUser.email;
}

if (payBtn && checkoutForm) {
  payBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const inputs = checkoutForm.querySelectorAll("input[required]");
    let allFilled = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        allFilled = false;
        input.style.borderColor = "red";
      } else {
        input.style.borderColor = "#ddd";
      }
    });

    if (!allFilled) {
      alert("Please fill in all required fields.");
      return;
    }

    // ✅ If valid
    localStorage.removeItem("rs_cart");
    window.location.href = "success.html";
  });
}