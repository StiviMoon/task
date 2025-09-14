import page from "page";
import { login, forgotPassword } from "../services/authService.js";
import "../styles/main.css";
import "../styles/components.css";
import "../styles/pages.css";

// ====================== LOGIN ======================
export function renderLogin() {
  return `
    <div class="login-container">
      <div class="login-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Inicia sesión</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Correo electrónico" required />
          <input type="password" id="password" placeholder="Contraseña" required />
          <button type="submit">Ingresar</button>
        </form>
        <p>
          <a href="#" id="forgotPassword">¿Olvidaste tu contraseña?</a>
        </p>
        <p>¿No tienes cuenta?
          <a href="#" id="goToRegister">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `;
}

export function addLoginLogic() {
  const form = document.getElementById("loginForm");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // Mostrar loading
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Iniciando sesión...";

    try {
      const result = await login({ email, password });

      if (result.success) {
        console.log("Login exitoso:", result);
        // Redirigir al dashboard
        page("/tasks");
      } else {
        console.error("Error en login:", result.error);
        showError("Credenciales inválidas. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en login:", error);
      showError("Error de conexión. Intenta de nuevo.");
    } finally {
      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  document.getElementById("goToRegister").addEventListener("click", (e) => {
    e.preventDefault();
    page("/signup");
  });

  document.getElementById("forgotPassword").addEventListener("click", (e) => {
    e.preventDefault();
    page("/forgot-password");
  });
}

// ====================== FORGOT PASSWORD ======================
export function renderForgotPassword() {
  return `
    <div class="login-container">
      <div class="login-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Recuperar contraseña</h2>
        <p>Ingresa tu correo para enviarte un enlace de restablecimiento</p>
        <form id="forgotForm">
          <input type="email" id="forgotEmail" placeholder="Correo electrónico" required />
          <button type="submit">Enviar enlace</button>
          <div id="spinner" class="hidden">⏳</div>
        </form>
        <div id="toast" class="toast hidden"></div>
        <p>
          <a href="#" id="backToLogin">Volver al login</a>
        </p>
      </div>
    </div>
  `;
}

export function addForgotPasswordLogic() {
  const form = document.getElementById("forgotForm");
  const spinner = document.getElementById("spinner");
  const toast = document.getElementById("toast");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();

    if (!email) {
      showToast("❌ Por favor ingresa tu correo", toast);
      return;
    }

    // Mostrar loading
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Enviando...";

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        showToast("✅ Revisa tu correo para continuar", toast);
        console.log("Recuperación enviada a:", email);
      } else {
        showToast(`❌ ${result.error}`, toast);
      }
    } catch (error) {
      console.error("Error en forgot password:", error);
      showToast("❌ Error de conexión. Intenta de nuevo.", toast);
    } finally {
      // Restaurar UI
      spinner.classList.add("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    page("/");
  });
}

// ====================== HELPER FUNCTIONS ======================
function showToast(message, toastEl) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 3000);
}

function showError(message) {
  // Crear o actualizar elemento de error
  let errorEl = document.getElementById("login-error");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "login-error";
    errorEl.className = "error-message";
    errorEl.style.cssText = `
      background: #fee;
      color: #c33;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      text-align: center;
    `;
    const form = document.getElementById("loginForm");
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
