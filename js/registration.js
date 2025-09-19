// js/registration.js
import { api, saveToken } from "./api.js";

const form = document.getElementById("registration-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Grab fields
    const usernameEl = document.getElementById("reg-username");
    const emailEl = document.getElementById("reg-email");
    const password1El = document.getElementById("password1");
    const password2El = document.getElementById("password2");
    const avatarFile = document.getElementById("avatarInput").files[0] || null;

    const usernameError = document.getElementById("username-error");
    const emailError = document.getElementById("email-error");
    const pwError = document.getElementById("pw-error");
    const confirmError = document.getElementById("confirm-error");

    // --- Local validation ---
    let valid = true;

    if (usernameEl.value.trim().length < 3) {
      usernameError.hidden = false;
      valid = false;
    } else usernameError.hidden = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailEl.value.trim())) {
      emailError.hidden = false;
      valid = false;
    } else emailError.hidden = true;

    if (password1El.value.trim().length < 3) {
      pwError.hidden = false;
      valid = false;
    } else pwError.hidden = true;

    if (password2El.value.trim() !== password1El.value.trim()) {
      confirmError.hidden = false;
      valid = false;
    } else confirmError.hidden = true;

    // Stop if validation failed
    if (!valid) return;

    // --- Build FormData for API ---
    const fd = new FormData();
    fd.append("username", usernameEl.value.trim());
    fd.append("email", emailEl.value.trim());
    fd.append("password", password1El.value.trim());
    fd.append("password_confirmation", password2El.value.trim());
    if (avatarFile) fd.append("avatar", avatarFile);

    // --- Send to API ---
    const { ok, status, data } = await api("/register", {
      method: "POST",
      body: fd
    });

    if (ok) {
      if (data?.token) saveToken(data.token);
      window.location.href = "index.html"; // or products.html
      return;
    }

    // --- Handle API errors ---
    if (status === 422 && data?.errors) {
      Object.entries(data.errors).forEach(([field, msg]) => {
        const el = document.getElementById(
          field === "password_confirmation" ? "confirm-error" :
          field === "password" ? "pw-error" :
          field === "email" ? "email-error" :
          field === "username" ? "username-error" : null
        );
        if (el) {
          el.textContent = Array.isArray(msg) ? msg[0] : msg;
          el.hidden = false;
        }
      });
    } else {
      alert("Registration failed. Please try again.");
    }
  });
}