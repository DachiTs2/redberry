import { api, saveToken, saveUser } from "./api.js";

const form = document.getElementById("registration-form");

const avatarImg = document.getElementById("avatar");
const avatarInput = document.getElementById("avatarInput");
const uploadBtn = document.getElementById("uploadBtn");
const removeBtn = document.getElementById("removeBtn");



// Avatar upload preview
if (uploadBtn && avatarInput && avatarImg && removeBtn) {
  uploadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    avatarInput.click();
  });

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (!file) return;

    // ✅ Validate type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (jpg, png, etc.)");
      avatarInput.value = "";
      return;
    }

    // ✅ Validate size
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image must be smaller than 2 MB");
      avatarInput.value = "";
      return;
    }

    // ✅ Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarImg.src = e.target.result;
      avatarImg.style.display = "block";

      // 🔑 Toggle buttons
      uploadBtn.style.display = "none";
      removeBtn.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  });
}

// Remove button
if (removeBtn && avatarImg && avatarInput && uploadBtn) {
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    avatarImg.src = "assets/avatar.png";
    avatarImg.style.display = "none";
    avatarInput.value = "";

    // 🔑 Toggle buttons back
    removeBtn.style.display = "none";
    uploadBtn.style.display = "inline-flex";
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
      console.error("Registration failed", status, data);
      alert("Registration failed. Please try again.");
    }
  });
}