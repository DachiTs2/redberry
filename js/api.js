// js/api.js
const API_BASE = "https://api.redseam.redberryinternship.ge/api";

// Token helpers
export function saveToken(token) {
  localStorage.setItem("authToken", token);
}
export function getToken() {
  return localStorage.getItem("authToken");
}
export function clearToken() {
  localStorage.removeItem("authToken");
}

// Generic request helper
export async function api(path, { method = "GET", headers = {}, body, auth = false } = {}) {
  const finalHeaders = { Accept: "application/json", ...headers };
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { method, headers: finalHeaders, body });
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  return { ok: res.ok, status: res.status, data };
}