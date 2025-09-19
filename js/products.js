// js/products.js
import { api, getToken, clearToken } from "./api.js";

// Guard: if no token, send to login
if (!getToken()) {
  window.location.href = "index.html";
}

// Fetch products
(async () => {
  const { ok, data, status } = await api("/products", { method: "GET", auth: true });
  if (!ok) {
    if (status === 401) {
      clearToken();
      window.location.href = "index.html";
    } else {
      alert("Failed to load products.");
    }
    return;
  }

  console.log("Products:", data);
  // TODO: render products into your grid
})();