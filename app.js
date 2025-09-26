document.addEventListener("DOMContentLoaded", () => {

  const filterBtn = document.getElementById("btn-filter");
  const filterPanel = document.getElementById("filter-panel");
  const sortBtn = document.getElementById("sort");
  const sortPanel = document.getElementById("sort-panel");

  if (filterBtn && filterPanel) {
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      filterPanel.hidden = !filterPanel.hidden;
      if (sortPanel) sortPanel.hidden = true;
    });
  }

  if (sortBtn && sortPanel) {
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sortPanel.hidden = !sortPanel.hidden;
      if (filterPanel) filterPanel.hidden = true;
    });
  }

  if (filterPanel) filterPanel.addEventListener("click", (e) => e.stopPropagation());
  if (sortPanel) sortPanel.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    if (filterPanel) filterPanel.hidden = true;
    if (sortPanel) sortPanel.hidden = true;
  });


  function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    icon.style.cursor = "pointer";
    icon.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
    });
  }

  togglePassword("password", "togglePassword1");
  togglePassword("password1", "togglePass1");
  togglePassword("password2", "togglePass2");


  const logo = document.getElementById("logo");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.location.href = "main.html"; 
    });
  }


const navLogin = document.getElementById("nav-login");
const logInAlt = document.getElementById("logIn");

if (navLogin) {
  navLogin.style.cursor = "pointer";
  navLogin.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

if (logInAlt) {
  logInAlt.style.cursor = "pointer";
  logInAlt.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const token = localStorage.getItem("authToken"); 
const navCart = document.getElementById("nav-cart");

if (token) {
  if (navLogin) navLogin.style.display = "none";
  if (navCart) navCart.style.display = "flex";
} else {
  if (navLogin) navLogin.style.display = "flex";
  if (navCart) navCart.style.display = "none";
}
});
