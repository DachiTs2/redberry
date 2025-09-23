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

// User helpers
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}
export function clearUser() {
  localStorage.removeItem("user");
}

// Generic request helper
export async function api(
  path,
  { method = "GET", headers = {}, body, auth = false } = {}
) {
  const finalHeaders = { Accept: "application/json", ...headers };

  // Auto-handle JSON body
  if (body && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, { method, headers: finalHeaders, body });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* no JSON body */
    }
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: { message: "Network error", error } };
  }
}