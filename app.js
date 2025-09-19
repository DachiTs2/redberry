
const filterBtn = document.getElementById("btn-filter");
const filterPanel = document.getElementById("filter-panel");
const sortBtn = document.getElementById("sort");
const sortPanel = document.getElementById("sort-panel");

//  filter on main page
if (filterBtn && filterPanel) {
  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanel.hidden = !filterPanel.hidden;
    if (sortPanel) sortPanel.hidden = true;
  });
}

// sort on main page 
if (sortBtn && sortPanel) {
  sortBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sortPanel.hidden = !sortPanel.hidden;
    if (filterPanel) filterPanel.hidden = true;
  });
}

// closing 
if (filterPanel || sortPanel) {
  document.addEventListener("click", () => {
    if (filterPanel) filterPanel.hidden = true;
    if (sortPanel) sortPanel.hidden = true;
  });
}

//showing passwords
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  icon.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password"; 
  });
}

if (document.getElementById("password") && document.getElementById("togglePassword1")) {
  togglePassword("password", "togglePassword1");
}

if (document.getElementById("password1") && document.getElementById("togglePass1")) {
  togglePassword("password1", "togglePass1");
}

if (document.getElementById("password2") && document.getElementById("togglePass2")) {
  togglePassword("password2", "togglePass2");
}
const avatar = document.getElementById("avatar");
const avatarInput = document.getElementById("avatarInput");
const uploadBtn = document.getElementById("uploadBtn");
const removeBtn = document.getElementById("removeBtn");

// start hidden
if (avatar) {
  avatar.style.display = "none";
}

// Upload new photo
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

// Remove photo
if (removeBtn && avatar && avatarInput) {
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    avatar.src = "";
    avatar.style.display = "none"; 
    avatarInput.value = ""; 
  });
}

// login validation
const emailInput = document.getElementById("username");
const pwInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const pwError = document.getElementById("pw-error");
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    let valid = true;

    const emailValue = emailInput.value.trim();
    if (emailValue.length < 3 || !emailValue.includes("@")) {
      emailError.hidden = false;
      valid = false;
    } else {
      emailError.hidden = true;
    }

    
    const pwValue = pwInput.value.trim();
    if (pwValue.length < 3) {
      pwError.hidden = false;
      valid = false;
    } else {
      pwError.hidden = true;
    }

    if (valid) {
      console.log("Form is valid, submitting...");
      loginForm.submit(); 
    }
  });
}
// registration validation
const regForm = document.getElementById("registration-form");

const username = document.getElementById("reg-username");
const email = document.getElementById("reg-email");
const password = document.getElementById("password1");
const confirmPw = document.getElementById("password2");

const usernameError = document.getElementById("username-error");
const confirmError = document.getElementById("confirm-error");


const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");



if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Username: at least 3 characters
    if (username.value.trim().length < 3) {
      usernameError.hidden = false;
      valid = false;
    } else {
      usernameError.hidden = true;
    }

    // Email: must look like a real email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      emailError.hidden = false;
      valid = false;
    } else {
      emailError.hidden = true;
    }

    // Password: at least 3 characters
    if (password1.value.trim().length < 3) {
      pwError.hidden = false;
      valid = false;
    } else {
      pwError.hidden = true;
    }

    // Confirm password: must match password
    if (password2.value.trim() !== password1.value.trim()) {
      confirmError.hidden = false;
      valid = false;
    } else {
      confirmError.hidden = true;
    }

    // If everything is valid
    if (valid) {
      console.log("submitting");
      regForm.submit();
    }
  });
}