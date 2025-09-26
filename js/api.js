const API_BASE = "https://api.redseam.redberryinternship.ge/api";

export function saveToken(token) {
  localStorage.setItem("authToken", token);
}
export function getToken() {
  return localStorage.getItem("authToken");
}
export function clearToken() {
  localStorage.removeItem("authToken");
}

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

export async function api(
  path,
  { method = "GET", headers = {}, body, auth = false } = {}
) {
  const finalHeaders = { Accept: "application/json", ...headers };

  
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
    }
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: { message: "Network error", error } };
  }
}