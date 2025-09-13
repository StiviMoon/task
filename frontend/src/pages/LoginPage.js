import page from "page";
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    console.log("Intento de login:", { email, password });
    

    // Redirigir al dashboard con Page.js
    page("/tasks");
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    spinner.classList.remove("hidden");

    const email = document.getElementById("forgotEmail").value;

    // Simula llamada al backend (≤ 3s)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    spinner.classList.add("hidden");
    showToast("✅ Revisa tu correo para continuar", toast);
    console.log("Recuperación enviada a:", email);
  });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    page("/");
  });
}

// ====================== HELPER TOAST ======================
function showToast(message, toastEl) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 3000);
}
