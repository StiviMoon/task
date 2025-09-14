import { resetPassword } from "../services/authService.js";
import "../styles/main.css";
import "../styles/components.css";
import "../styles/pages.css";

/**
 * Renderiza la página de restablecimiento de contraseña
 * @returns {string} HTML de la página
 */
export function renderResetPassword() {
  return `
    <div class="login-container">
      <div class="login-card">
        <img src="logo.png" alt="Logo" class="logo" />
        <h2>Restablecer contraseña</h2>
        <p>Ingresa tu nueva contraseña</p>
        <form id="resetForm">
          <input type="password" id="newPassword" placeholder="Nueva contraseña" required />
          <input type="password" id="confirmPassword" placeholder="Confirmar contraseña" required />
          <button type="submit">Restablecer contraseña</button>
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

/**
 * Añade la lógica para la página de restablecimiento de contraseña
 */
export function addResetPasswordLogic() {
  const form = document.getElementById("resetForm");
  const spinner = document.getElementById("spinner");
  const toast = document.getElementById("toast");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  // Obtener el token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    showToast("❌ Token de restablecimiento no válido", toast);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validaciones
    if (!newPassword || !confirmPassword) {
      showToast("❌ Por favor completa todos los campos", toast);
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("❌ Las contraseñas no coinciden", toast);
      return;
    }

    if (newPassword.length < 8) {
      showToast("❌ La contraseña debe tener al menos 8 caracteres", toast);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      showToast("❌ La contraseña debe tener al menos una mayúscula", toast);
      return;
    }

    if (!/\d/.test(newPassword)) {
      showToast("❌ La contraseña debe tener al menos un número", toast);
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      showToast("❌ La contraseña debe tener al menos un carácter especial", toast);
      return;
    }

    // Mostrar loading
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Restableciendo...";

    try {
      const result = await resetPassword({ token, newPassword });

      if (result.success) {
        showToast("✅ Contraseña restablecida exitosamente", toast);
        console.log("Contraseña restablecida");

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showToast(`❌ ${result.error}`, toast);
      }
    } catch (error) {
      console.error("Error en reset password:", error);
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
    window.location.href = '/';
  });
}

/**
 * Muestra un mensaje toast
 * @param {string} message - Mensaje a mostrar
 * @param {HTMLElement} toastEl - Elemento toast
 */
function showToast(message, toastEl) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 5000);
}
