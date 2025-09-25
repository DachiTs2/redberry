document.addEventListener("DOMContentLoaded", () => {
  const filterBtn = document.getElementById("btn-filter");
  const filterPanel = document.getElementById("filter-panel");
  const sortBtn = document.getElementById("sort");
  const sortPanel = document.getElementById("sort-panel");

  // --- Filter Panel ---
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      filterPanel.hidden = !filterPanel.hidden;
      if (sortPanel) sortPanel.hidden = true;
    });
  }

  // --- Sort Panel ---
  if (sortBtn && sortPanel) {
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sortPanel.hidden = !sortPanel.hidden;
      if (filterPanel) filterPanel.hidden = true;
    });
  }

  // Prevent closing when clicking inside
  if (filterPanel) filterPanel.addEventListener("click", (e) => e.stopPropagation());
  if (sortPanel) sortPanel.addEventListener("click", (e) => e.stopPropagation());

  // Close when clicking outside
  document.addEventListener("click", () => {
    if (filterPanel) filterPanel.hidden = true;
    if (sortPanel) sortPanel.hidden = true;
  });

  // --- Password Toggle ---
  function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    icon.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
    });
  }

  togglePassword("password", "togglePassword1");
  togglePassword("password1", "togglePass1");
  togglePassword("password2", "togglePass2");

  // --- Avatar Upload ---
  const avatar = document.getElementById("avatar");
  const avatarInput = document.getElementById("avatarInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const removeBtn = document.getElementById("removeBtn");

  if (avatar) avatar.style.display = "none";

  if (uploadBtn && avatarInput && avatar) {
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      avatarInput.value = "";
      avatarInput.click();
    });

    avatarInput.addEventListener("change", () => {
      const file = avatarInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          avatar.src = e.target.result;
          avatar.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeBtn && avatar && avatarInput) {
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      avatar.src = "assets/avatar.png";
      avatar.style.display = "none";
      avatarInput.value = "";
    });
  }

  // --- Navbar Logo Navigation ---
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", () => {
      const token = localStorage.getItem("rs_token"); 
      if (token) {
        window.location.href = "main.html"; 
      } else {
        window.location.href = "index.html"; 
      }
    });
  }

  // --- Navbar Log In Button ---
  const logInBtn = document.getElementById("logIn");
  if (logInBtn) {
    logInBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});



