// js/products.js
import { api, getToken, clearToken } from "./api.js";

// ---------- Guard ----------
if (!getToken()) {
  window.location.href = "index.html";
}

// ---------- Navbar User + Logout ----------
const navRight = document.getElementById("nav-right");
const storedUser = localStorage.getItem("user");

if (storedUser && navRight) {
  const user = JSON.parse(storedUser);

 const userMenu = document.createElement("div");
userMenu.id = "user-menu";

let avatarHtml = "";
if (user.profile_photo) {
  avatarHtml = `<img id="user-avatar" src="${user.profile_photo}" 
      alt="User Avatar" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">`;
}

userMenu.innerHTML = `
  ${avatarHtml}
  <img id="dropdown-icon" src="assets/chevron-down.svg" alt="Expand">
`;
navRight.appendChild(userMenu);

  // Dropdown menu
  const dropdown = document.createElement("div");
  dropdown.id = "dropdown-menu";
  dropdown.style.cssText = `
    position:absolute; top:60px; right:20px; background:#fff; border:1px solid #E1DFE1;
    border-radius:8px; padding:8px; display:none; z-index:200;
  `;
  dropdown.innerHTML = `<button id="logoutBtn" class="page-btn">Logout</button>`;
  navRight.appendChild(dropdown);

  userMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });

  dropdown.addEventListener("click", (e) => e.stopPropagation());

  dropdown.querySelector("#logoutBtn").addEventListener("click", () => {
    clearToken();
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
}

// ---------- Containers ----------
const productsContainer = document.querySelector(".full-containers");
const paginationEl = document.getElementById("pagination");

// ---------- Load Products ----------
async function loadProducts(page = 1, filters = {}) {
  const params = new URLSearchParams({ page });

  // price filters
  if (filters.min_price) params.append("filter[price_from]", filters.min_price);
  if (filters.max_price) params.append("filter[price_to]", filters.max_price);

  //  sorting
  if (filters.sort) {
    const sortValue = filters.order === "desc" ? `-${filters.sort}` : filters.sort;
    params.append("sort", sortValue);
  }

  const { ok, data } = await api(`/products?${params.toString()}`, { auth: true });

  if (!ok || !data) {
    productsContainer.innerHTML = "<p id='results-info'>Failed to load products.</p>";
    return;
  }

  //  Update results info
  const resultsInfo = document.getElementById("results-info");
  if (resultsInfo) {
    resultsInfo.textContent = `Showing ${data.meta.from}–${data.meta.to} of ${data.meta.total} products`;
  }

  //  Render products
  const products = data.data;
  productsContainer.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.cover_image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
    </div>
  `).join("");


  //  Click → product page
productsContainer.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => {
    const productId = card.dataset.id;

    // add a short delay so the animation is visible
    setTimeout(() => {
      window.location.href = `product.html?id=${productId}`;
    }, 150); // 150ms matches the CSS transition
  });
});


  renderPagination(data.meta, filters);
}

// ---------- Render Pagination ----------
function renderPagination(meta, filters = {}) {
  paginationEl.innerHTML = "";

  for (let p = 1; p <= meta.last_page; p++) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    if (p === meta.current_page) btn.classList.add("active");
    btn.textContent = p;

    btn.addEventListener("click", () => {
      loadProducts(p, filters);
      productsContainer.scrollIntoView({ behavior: "smooth" });
    });

    paginationEl.appendChild(btn);
  }
}
// ---------- Filter ----------
const applyFilterBtn = document.getElementById("apply-filter");

if (applyFilterBtn) {
  applyFilterBtn.addEventListener("click", () => {
    const min = document.getElementById("price-from").value;
    const max = document.getElementById("price-to").value;

    loadProducts(1, {
      min_price: min || undefined,
      max_price: max || undefined,
    });
    const filterPanel = document.getElementById("filter-panel");
    if (filterPanel) filterPanel.hidden = true;
  });
}
// ---------- Sort ----------
document.querySelectorAll(".sort-option").forEach(btn => {
  btn.addEventListener("click", () => {
    const sort = btn.dataset.sort;
    const order = btn.dataset.order;

    loadProducts(1, { sort, order });
    const sortPanel = document.getElementById("sort-panel");
    if (sortPanel) sortPanel.hidden = true;
  });
});
// ---------- Init ----------
loadProducts();