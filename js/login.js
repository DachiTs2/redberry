// js/login.js
import { api, saveToken } from "./api.js";

const form = document.getElementById("login-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // /login expects application/json (per your docs)
    const { ok, status, data } = await api("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (ok && data?.token) {
      saveToken(data.token);
      window.location.href = "products.html"; // go to products
      return;
    }

    // Show your existing error <p>s
    const emailError = document.getElementById("email-error");
    const pwError = document.getElementById("pw-error");

    if (status === 422 && data?.message) {
      if (emailError) { emailError.textContent = data.message; emailError.hidden = false; }
    } else if (status === 401) {
      if (pwError) { pwError.textContent = "Invalid credentials."; pwError.hidden = false; }
    } else {
      alert("Login failed. Please try again.");
    }
  });
}