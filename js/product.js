// js/product.js
import { api, getToken } from "./api.js";

// --------- Guard: login required ---------
if (!getToken()) {
  window.location.href = "index.html";
}

// --------- Elements ---------
const mainImage   = document.querySelector(".main-image img");
const thumbnails  = document.querySelector(".thumbnails");
const titleEl     = document.querySelector(".product-info h1");
const priceEl     = document.querySelector(".price");

// Details
const detailsEl   = document.getElementById("product-description");
const brandTextEl = document.getElementById("brand-text");
const brandLogoEl = document.getElementById("brand-logo");

// Color/Size UI
const colorOptions = document.getElementById("color-options");
const colorLabel   = document.getElementById("color-label");
const sizeOptions  = document.getElementById("size-options");
const sizeLabel    = document.getElementById("size-label");

// Quantity select
const qtySelect    = document.getElementById("qty-select");

// Add-to-cart button
const addBtn = document.querySelector(".add-to-cart");

// --------- Get ID from URL ---------
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// State for selections
let selectedColor = null;
let selectedSize  = null;
let product = null;

// --------- Load Product ---------
async function loadProduct() {
  const { ok, data } = await api(`/products/${productId}`, { auth: true });
  if (!ok || !data) {
    if (titleEl) titleEl.textContent = "Failed to load product.";
    return;
  }

  product = data;

  // Fill product info
  if (titleEl)  titleEl.textContent = product.name || "";
  if (priceEl)  priceEl.textContent = product.price != null ? `$${product.price}` : "";
  if (detailsEl) detailsEl.textContent = product.description || "No description available.";
  if (brandTextEl) brandTextEl.textContent = product.brand?.name || "";
  if (brandLogoEl && product.brand?.image) {
    brandLogoEl.src = product.brand.image;
    brandLogoEl.alt = product.brand.name || "Brand";
  }

  // Main image
  if (mainImage) mainImage.src = product.cover_image;

  // Thumbnails
  if (thumbnails) {
    thumbnails.innerHTML = (product.images || []).map(img => `
      <img src="${img}" alt="${product.name}">
    `).join("");

   thumbnails.querySelectorAll("img").forEach((img, index) => {
  img.addEventListener("click", () => {
    // Change the main image
    mainImage.src = img.src;

    // If the clicked thumbnail corresponds to a color, update selectedColor
    if (Array.isArray(product.available_colors) && product.available_colors[index]) {
      selectedColor = product.available_colors[index];

      // Update label
      if (colorLabel) {
        colorLabel.textContent = `Color: ${selectedColor}`;
      }

      // Highlight the correct color button
      const colorBtns = colorOptions.querySelectorAll(".color-circle");
      colorBtns.forEach(b => b.classList.remove("active"));
      if (colorBtns[index]) {
        colorBtns[index].classList.add("active");
      }
    }
  });
});
  }

 // -------- COLORS --------
if (product.available_colors && colorOptions) {
  colorOptions.innerHTML = product.available_colors.map((c, i) => `
    <button class="color-circle ${i === 0 ? "active" : ""}" 
            title="${c}" 
            style="background:${c.toLowerCase()};"></button>
  `).join("");

  const colorBtns = colorOptions.querySelectorAll(".color-circle");

  // ✅ select the first color by default
  if (colorBtns.length > 0) {
    selectedColor = colorBtns[0].title;
    colorLabel.textContent = `Color: ${selectedColor}`;
  }

  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedColor = btn.title;
      colorLabel.textContent = `Color: ${selectedColor}`;
      colorBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mainImage.src = product.images[colorBtns.length > 1 ? [...colorBtns].indexOf(btn) : 0] || product.cover_image;
    });
  });
}

  // ---------- SIZES ----------
  if (Array.isArray(product.available_sizes) && sizeOptions) {
    selectedSize = product.available_sizes[0] || null;

    sizeOptions.innerHTML = product.available_sizes.map((s, i) => `
      <button class="size-btn ${i === 0 ? "active" : ""}" title="${s}">${s}</button>
    `).join("");

    if (sizeLabel) sizeLabel.textContent = `Size: ${selectedSize ?? "-"}`;

    const sizeBtns = sizeOptions.querySelectorAll(".size-btn");
    sizeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        selectedSize = btn.title;
        if (sizeLabel) sizeLabel.textContent = `Size: ${selectedSize}`;
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  // ---------- ADD TO CART ----------
if (addBtn) {
  addBtn.addEventListener("click", () => {
    const qty = parseInt(qtySelect?.value, 10) || 1;

    // ✅ use the actual image currently shown
    const imageToUse = mainImage?.src || product.cover_image;

    if (typeof window.addToCart === "function") {
      window.addToCart(
        product,
        selectedColor,     // ✅ always the chosen color
        selectedSize,      // ✅ chosen size
        qty,
        imageToUse         // ✅ pass selected image too
      );
    }
  });
} }

// --------- Init ---------
loadProduct();