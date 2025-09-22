import page from "page";
import { login, forgotPassword } from "../services/authService.js";
// ====================== LOGIN ======================
/**
 * Render the login page template.
 * @returns {string} HTML markup for the login screen
 */
export function renderLogin() {
  return `
    <div class="login-container">
      <div class="login-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Inicia sesión</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Correo electrónico" required />
          <div class="password-input-wrapper">
            <input type="password" id="password" placeholder="Contraseña" required />
            <button type="button" class="password-toggle" id="passwordToggle" aria-label="Mostrar contraseña">
              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Ingresar</button>
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
/**
 * Attach login logic:
 * - Handles form submission
 * - Calls backend login API
 * - Redirects on success or shows error
 */
export function addLoginLogic() {
  const form = document.getElementById("loginForm");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;
 /**
   * Handles login form submission.
   * @event submit
   * @property {string} email - User email.
   * @property {string} password - User password.
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // Show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.textContent = 'Iniciando sesión...';

    try {
      const result = await login({ email, password });

      if (result.success) {
        console.log("Login exitoso:", result);
        // Redirect to the dashboard
        page("/tasks");
      } else {
        showError(result.error);
      }
    } catch (error) {
      console.error("Error en login:", error);
      showError("Error de conexión. Intenta de nuevo.");
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-loading');
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

  // Password visibility toggle
  const passwordToggle = document.getElementById("passwordToggle");
  const passwordInput = document.getElementById("password");

  passwordToggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // Update icon and aria-label
    const svg = passwordToggle.querySelector("svg");
    if (isPassword) {
      // Show "hide" icon
      svg.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
      passwordToggle.setAttribute("aria-label", "Ocultar contraseña");
    } else {
      // Show "show" icon
      svg.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
      passwordToggle.setAttribute("aria-label", "Mostrar contraseña");
    }
  });
}

// ====================== FORGOT PASSWORD ======================
/**
 * Render the forgot password page template.
 * @returns {string} HTML markup for forgot password screen
 */
export function renderForgotPassword() {
  return `
    <div class="login-container">
      <div class="login-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Recuperar contraseña</h2>
        <p>Ingresa tu correo para enviarte un enlace de restablecimiento</p>
        <form id="forgotForm">
          <input type="email" id="forgotEmail" placeholder="Correo electrónico" required />
          <button type="submit" class="btn btn-primary btn-full">Enviar enlace</button>
        </form>
        <div id="toast" class="toast hidden"></div>
        <p>
          <a href="#" id="backToLogin">Volver al login</a>
        </p>
      </div>
    </div>
  `;
}
/**
 * Attach forgot password logic:
 * - Handles form submission
 * - Calls backend forgotPassword API
 * - Displays toast messages
 */
export function addForgotPasswordLogic() {
  const form = document.getElementById("forgotForm");
  const spinner = document.getElementById("spinner");
  const toast = document.getElementById("toast");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;
/**
   * Handles forgot password form submission.
   * @event submit
   * @property {string} email - User email for password recovery.
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();

    if (!email) {
      showToast("Por favor ingresa tu correo electrónico", toast);
      return;
    }

    // show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.textContent = "Enviando...";

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        showToast("Revisa tu correo para continuar", toast);
        console.log("Recuperación enviada a:", email);
      } else {
        showToast(result.error, toast);
      }
    } catch (error) {
      console.error("Error en forgot password:", error);
      showToast("Error de conexión. Intenta de nuevo.", toast);
    } finally {
      // Restore UI
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-loading');
      submitBtn.textContent = originalBtnText;
    }
  });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    page("/");
  });
}

// ====================== HELPER FUNCTIONS ======================
/**
 * Display a temporary toast message.
 * @param {string} message - The message to show
 * @param {HTMLElement} toastEl - The toast element
 */
function showToast(message, toastEl) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 3000);
}
/**
 * Display an error message inside the login form.
 * @param {string} message - The error text
 */
function showError(message) {
  // Create or update error element
  let errorEl = document.getElementById("login-error");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "login-error";
    errorEl.className = "error-message";
    const form = document.getElementById("loginForm");
    form.insertBefore(errorEl, form.firstChild);
  }

  errorEl.textContent = message;
  errorEl.classList.remove("hidden");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (errorEl) {
      errorEl.classList.add("hidden");
    }
  }, 5000);
}
