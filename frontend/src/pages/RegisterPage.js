import page from "page";
import { register } from "../services/authService.js";
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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!isFormValid()) {
      showError("Por favor completa todos los campos correctamente");
      return;
    }

    spinner.classList.remove("hidden");
    btn.disabled = true;
    btn.textContent = "⏳ Creando cuenta...";

    try {
      // Preparar datos para el backend
      const userData = {
        name: inputs.names.value.trim(),
        lastName: inputs.surnames.value.trim(),
        age: parseInt(inputs.age.value, 10),
        email: inputs.email.value.trim(),
        password: inputs.password.value
      };

      const result = await register(userData);

      if (result.success) {
        console.log("Usuario creado exitosamente:", result.data);
        toast.textContent = "✅ Cuenta creada exitosamente";
        toast.classList.remove("hidden");

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          toast.classList.add("hidden");
          page("/");
        }, 2000);
      } else {
        console.error("Error al crear usuario:", result.error);
        showError(result.error || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      showError("Error de conexión. Intenta de nuevo.");
    } finally {
      // Restaurar UI
      spinner.classList.add("hidden");
      btn.disabled = false;
      btn.textContent = "Registrarse";
    }
  });

  // Button to go to login
  document.getElementById("goToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    page("/");
  });

  // Helper function to show errors
  function showError(message) {
    // Crear o actualizar elemento de error
    let errorEl = document.getElementById("register-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.id = "register-error";
      errorEl.className = "error-message";
      errorEl.style.cssText = `
        background: #fee;
        color: #c33;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
        text-align: center;
      `;
      const form = document.getElementById("registerForm");
      form.insertBefore(errorEl, form.firstChild);
    }

    errorEl.textContent = message;
    errorEl.style.display = "block";

    // Auto-hide después de 5 segundos
    setTimeout(() => {
      if (errorEl) {
        errorEl.style.display = "none";
      }
    }, 5000);
  }
}
