import page from "page";
import { register } from "../services/authService.js";

export function renderRegister() {
  return `
    <div class="register-container">
      <div class="register-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Crear cuenta</h2>
        <form id="registerForm" novalidate>
          <div class="input-group">
            <input type="text" id="names" placeholder="Nombres" required />
            <div class="error" id="error-names"></div>
          </div>

          <div class="input-group">
            <input type="text" id="surnames" placeholder="Apellidos" required />
            <div class="error" id="error-surnames"></div>
          </div>

          <div class="input-group">
            <input type="number" id="age" placeholder="Edad" required />
            <div class="error" id="error-age"></div>
          </div>

          <div class="input-group">
            <input type="email" id="email" placeholder="Correo electrónico" required />
            <div class="error" id="error-email"></div>
          </div>

          <div class="input-group">
            <input type="password" id="password" placeholder="Contraseña" required />
            <div class="error" id="error-password"></div>
          </div>

          <div class="input-group">
            <input type="password" id="confirmPassword" placeholder="Confirmar contraseña" required />
            <div class="error" id="error-confirm"></div>
          </div>

          <button type="submit" id="registerBtn" class="btn btn-primary btn-full" disabled>Registrarse</button>
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
        return showError("names", "Ingrese sus nombres."), false;
      } else hideError("names");
    }

    if (field === "surnames") {
      if (inputs.surnames.value.trim() === "") {
        return showError("surnames", "Ingrese sus apellidos."), false;
      } else hideError("surnames");
    }

    if (field === "age") {
      const age = parseInt(inputs.age.value, 10);
      if (isNaN(age) || age < 13) {
        return showError("age", "La edad ingresada debe ser mayor o igual a 13."), false;
      } else hideError("age");
    }

    if (field === "email") {
      if (!/\S+@\S+\.\S+/.test(inputs.email.value)) {
        return showError("email", "Correo inválido."), false;
      } else hideError("email");
    }

    if (field === "password") {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passRegex.test(inputs.password.value)) {
        return showError("password", "Mínimo 8 caracteres, mayúscula, número y carácter especial."), false;
      } else hideError("password");
    }

    if (field === "confirm") {
      if (inputs.password.value !== inputs.confirm.value || inputs.confirm.value === "") {
        return showError("confirm", "Las contraseñas no coinciden."), false;
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
    const errorEl = document.getElementById(`error-${field}`);
    errorEl.innerText = msg;
    errorEl.classList.add("show-tooltip");

  }

  function hideError(field) {
    const errorEl = document.getElementById(`error-${field}`);
    errorEl.innerText = "";
    errorEl.classList.remove("show-tooltip");
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

    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.textContent = 'Creando cuenta...';

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

      console.log(result);

      if (result.success) {
        console.log("Usuario creado exitosamente:", result.data);
        toast.textContent = "Cuenta creada exitosamente";
        toast.classList.remove("hidden");

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          toast.classList.add("hidden");
          page("/");
        }, 2000);
      } else {
        console.error("Error al crear usuario:", result.error);
        showErrorForm(result.error || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      showErrorForm("Error de conexión. Intenta de nuevo.");
    } finally {
      btn.disabled = false;
      btn.classList.remove('btn-loading');
      btn.textContent = "Registrarse";
    }
  });

 // Helper function to show errors
  function showErrorForm(message) {
    // Crear o actualizar elemento de error
    let errorEl = document.getElementById("register-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.id = "register-error";
      errorEl.className = "error-message";
      const form = document.getElementById("registerForm");
      form.insertBefore(errorEl, form.firstChild);
    }

    errorEl.textContent = message;
    errorEl.classList.remove("hidden");

    // Auto-hide después de 5 segundos
    setTimeout(() => {
      if (errorEl) {
        errorEl.classList.add("hidden");
      }
    }, 5000);
  }

  // Button to go to login
  document.getElementById("goToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    page("/");
  });

}
