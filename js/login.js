import { api, saveToken, saveUser } from "./api.js";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email") || document.getElementById("username");
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
    if (emailError) {
      emailError.hidden = true;
      emailError.textContent = "Invalid email address. Please try again.";
    }
    if (pwError) {
      pwError.hidden = true;
      pwError.textContent = "Incorrect password. Please try again.";
    }

    // Call API
    const { ok, status, data } = await api("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email, password } 
    });

    if (ok && data?.token) {
      saveToken(data.token);
      saveUser(data.user); 
      window.location.href = "main.html";
      return;
    }

    // Handle errors
    if (status === 422 && data?.message) {
      if (data.message.toLowerCase().includes("email") && emailError) {
        emailError.textContent = data.message;
        emailError.hidden = false;
      }
    } else if (status === 401 && pwError) {
      pwError.textContent = "Invalid credentials.";
      pwError.hidden = false;
    } else {
      alert("Login failed. Please try again.");
    }
    // Client-side validation
if (password.length < 3) {
  if (pwError) {
    pwError.textContent = "Password must be at least 3 characters.";
    pwError.hidden = false;
  }
  return; // stop form here
}
  });
}

