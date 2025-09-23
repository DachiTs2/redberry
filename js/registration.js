import { api, saveToken, saveUser } from "./api.js";

const form = document.getElementById("registration-form");

const avatarImg = document.getElementById("avatar");
const avatarInput = document.getElementById("avatarInput");
const uploadBtn = document.getElementById("uploadBtn");
const removeBtn = document.getElementById("removeBtn");

// Password toggle setup
function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);

  if (input && toggle) {
    toggle.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.src = isPassword ? "assets/eye-off.png" : "assets/eye.png";
    });
  }
}
setupPasswordToggle("password1", "togglePass1");
setupPasswordToggle("password2", "togglePass2");

// Avatar upload preview
if (uploadBtn && avatarInput && avatarImg) {
  uploadBtn.addEventListener("click", () => avatarInput.click());

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarImg.src = e.target.result;
        avatarImg.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

if (removeBtn && avatarImg && avatarInput) {
  removeBtn.addEventListener("click", () => {
    avatarImg.src = "assets/avatar.png";
    avatarImg.style.display = "none";
    avatarInput.value = ""; 
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Grab fields
    const usernameEl = document.getElementById("reg-username");
    const emailEl = document.getElementById("reg-email");
    const password1El = document.getElementById("password1");
    const password2El = document.getElementById("password2");
    const avatarFile = avatarInput.files[0] || null;

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

    if (!valid) return;

    // --- Build FormData ---
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

    if (ok && data?.token) {
      saveToken(data.token);
      saveUser(data.user);
      window.location.href = "main.html";
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