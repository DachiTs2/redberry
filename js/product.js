// js/product.js
import { api, getToken } from "./api.js";

// --------- Guard: login required ---------
if (!getToken()) {
  window.location.href = "index.html";
}

// --------- Elements ---------
const mainImage = document.querySelector(".main-image img");
const thumbnails = document.querySelector(".thumbnails");
const titleEl = document.querySelector(".product-info h1");
const priceEl = document.querySelector(".price");

// Details
const detailsEl = document.getElementById("product-description");
const brandTextEl = document.getElementById("brand-text");
const brandLogoEl = document.getElementById("brand-logo");

// Colors
const colorOptions = document.getElementById("color-options");
const colorLabel = document.getElementById("color-label");

// Sizes
const sizeOptions = document.getElementById("size-options");
const sizeLabel = document.getElementById("size-label");

// --------- Get ID from URL ---------
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// --------- Load Product ---------
async function loadProduct() {
  const { ok, data } = await api(`/products/${productId}`, { auth: true });

  if (!ok || !data) {
    titleEl.textContent = "Failed to load product.";
    return;
  }

  const product = data;

  // -------- Fill product info --------
  titleEl.textContent = product.name;
  priceEl.textContent = `$${product.price}`;

  
 // Description & brand
if (detailsEl) detailsEl.textContent = product.description || "No description available.";

if (brandTextEl && product.brand?.name) {
  brandTextEl.textContent = product.brand.name;
}

if (brandLogoEl) {
  if (product.brand?.image) {
    brandLogoEl.src = product.brand.image;
    brandLogoEl.alt = product.brand.name || "";
    brandLogoEl.style.display = "block";
  } else {
    brandLogoEl.style.display = "none"; 
  }
}

  // -------- Main image --------
  if (mainImage) mainImage.src = product.cover_image;

  // -------- Thumbnails --------
  if (thumbnails) {
    thumbnails.innerHTML = product.images.map(img => `
      <img src="${img}" alt="${product.name}">
    `).join("");

    thumbnails.querySelectorAll("img").forEach(img => {
      img.addEventListener("click", () => {
        mainImage.src = img.src;
      });
    });
  }

  // -------- COLORS --------
  if (product.available_colors && colorOptions) {
    colorOptions.innerHTML = product.available_colors.map(c => `
      <button class="color-circle" title="${c}" style="background:${c.toLowerCase()};"></button>
    `).join("");

    colorOptions.querySelectorAll(".color-circle").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // Update label
        colorLabel.textContent = `Color: ${btn.title}`;

        // Highlight active color
        colorOptions.querySelectorAll(".color-circle").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // 👇 Update main image when a color is clicked
        if (product.images[index]) {
          mainImage.src = product.images[index];
        }
      });
    });
  }

  // -------- SIZES --------
  if (product.available_sizes && sizeOptions) {
    sizeOptions.innerHTML = product.available_sizes.map(s => `
      <button class="size-btn" title="${s}">${s}</button>
    `).join("");

    sizeOptions.querySelectorAll(".size-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sizeLabel.textContent = `Size: ${btn.title}`;
        sizeOptions.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
}

// --------- Init ---------
loadProduct();