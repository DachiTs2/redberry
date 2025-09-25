import { api, saveToken, saveUser } from "./api.js";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("password");
const togglePass = document.getElementById("togglePassword1");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const emailError = document.getElementById("email-error");
    const pwError = document.getElementById("pw-error");

    // Reset errors
    emailError.hidden = true;
    pwError.hidden = true;

    // Client-side validation
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      emailError.hidden = false;
      valid = false;
    }

    if (password.length < 3) {
      pwError.textContent = "Password must be at least 3 characters.";
      pwError.hidden = false;
      valid = false;
    }

    if (!valid) return;

    // Call API
    const { ok, status, data } = await api("/login", {
      method: "POST",
      body: { email, password }
    });

    if (ok && data?.token) {
      saveToken(data.token);
      saveUser(data.user);
      window.location.href = "main.html";
      return;
    }

    // Handle errors
    if (status === 401) {
      pwError.textContent = "Invalid email or password.";
      pwError.hidden = false;
    } else {
      alert("Login failed. Please try again.");
    }
  });
}

// Password toggle
if (togglePass && passwordInput) {
  togglePass.style.cursor = "pointer";
  togglePass.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
  });
}