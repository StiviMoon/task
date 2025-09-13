import page from "page";
import { renderLogin, addLoginLogic } from "./LoginPage.js";
import "../styles/main.css";
import "../styles/components.css";
import "../styles/pages.css";

export function renderRegister() {
  return `
    <div class="register-container">
      <div class="register-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Crear cuenta</h2>
        <form id="registerForm" novalidate>
          <input type="text" id="names" placeholder="Nombres" required />
          <div class="error" id="error-names"></div>

          <input type="text" id="surnames" placeholder="Apellidos" required />
          <div class="error" id="error-surnames"></div>

          <input type="number" id="age" placeholder="Edad" required />
          <div class="error" id="error-age"></div>

          <input type="email" id="email" placeholder="Correo electrónico" required />
          <div class="error" id="error-email"></div>

          <input type="password" id="password" placeholder="Contraseña" required />
          <div class="error" id="error-password"></div>

          <input type="password" id="confirmPassword" placeholder="Confirmar contraseña" required />
          <div class="error" id="error-confirm"></div>

          <button type="submit" id="registerBtn" disabled>Registrarse</button>
          <div id="spinner" class="hidden">⏳ Procesando...</div>
        </form>
        <p>¿Ya tienes cuenta? 
          <a href="#" id="goToLogin">Inicia sesión</a>
        </p>
      </div>
      <div id="toast" class="toast hidden">Cuenta creada con éxito</div>
    </div>
  `;
}

export function addRegisterLogic() {
  const form = document.getElementById("registerForm");
  const btn = document.getElementById("registerBtn");
  const spinner = document.getElementById("spinner");
  const toast = document.getElementById("toast");

  const inputs = {
    names: form.names,
    surnames: form.surnames,
    age: form.age,
    email: form.email,
    password: form.password,
    confirm: form.confirmPassword,
  };

  // validate fields
  function validateField(field) {
    if (field === "names") {
      if (inputs.names.value.trim() === "") {
        return showError("names", "Ingrese sus nombres"), false;
      } else hideError("names");
    }

    if (field === "surnames") {
      if (inputs.surnames.value.trim() === "") {
        return showError("surnames", "Ingrese sus apellidos"), false;
      } else hideError("surnames");
    }

    if (field === "age") {
      const age = parseInt(inputs.age.value, 10);
      if (isNaN(age) || age < 13) {
        return showError("age", "Edad ≥ 13"), false;
      } else hideError("age");
    }

    if (field === "email") {
      if (!/\S+@\S+\.\S+/.test(inputs.email.value)) {
        return showError("email", "Correo inválido"), false;
      } else hideError("email");
    }

    if (field === "password") {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passRegex.test(inputs.password.value)) {
        return showError("password", "Mínimo 8 caracteres, mayúscula, número y carácter especial"), false;
      } else hideError("password");
    }

    if (field === "confirm") {
      if (inputs.password.value !== inputs.confirm.value || inputs.confirm.value === "") {
        return showError("confirm", "Las contraseñas no coinciden"), false;
      } else hideError("confirm");
    }

    return true;
  }

  // Check if the entire form is valid
  function isFormValid() {
    return (
      inputs.names.value.trim() !== "" &&
      inputs.surnames.value.trim() !== "" &&
      parseInt(inputs.age.value, 10) >= 13 &&
      /\S+@\S+\.\S+/.test(inputs.email.value) &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(inputs.password.value) &&
      inputs.password.value === inputs.confirm.value &&
      inputs.confirm.value !== ""
    );
  }

  function showError(field, msg) {
    document.getElementById(`error-${field}`).innerText = msg;
  }

  function hideError(field) {
    document.getElementById(`error-${field}`).innerText = "";
  }

  // Real-time validation
  Object.entries(inputs).forEach(([key, input]) => {
    input.addEventListener("input", () => {
      validateField(key);
      btn.disabled = !isFormValid();
    });
  });

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    spinner.classList.remove("hidden");
    btn.disabled = true;

    setTimeout(() => {
      spinner.classList.add("hidden");
      toast.classList.remove("hidden");

      console.log("Usuario creado:", {
        id: Date.now(),
        names: inputs.names.value,
        surnames: inputs.surnames.value,
        age: inputs.age.value,
        email: inputs.email.value,
      });

      setTimeout(() => {
        toast.classList.add("hidden");
        page("/");
      }, 500);
    }, 2000);
  });

  // Button to go to login
  document.getElementById("goToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    page("/");
  });
}
