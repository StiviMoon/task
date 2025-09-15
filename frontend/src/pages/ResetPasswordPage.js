import { resetPassword } from "../services/authService.js";

/**
 * Renders the reset password page interface.
 *
 * @function renderResetPassword
 * @returns {string} HTML markup of the reset password page.
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
          <button type="submit" class="btn btn-primary btn-full">Restablecer contraseña</button>
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
 * Adds logic for the reset password page:
 *
 * - Retrieves the token from the URL.
 * - Validates the new password with multiple rules (length, uppercase, number, special character).
 * - Calls the `resetPassword` service to update the password.
 * - Displays feedback messages using `showToast`.
 * - Redirects the user to the login page if successful.
 *
 * @function addResetPasswordLogic
 * @returns {void}
 */
export function addResetPasswordLogic() {
  const form = document.getElementById("resetForm");
  const spinner = document.getElementById("spinner");
  const toast = document.getElementById("toast");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    showToast("Token de restablecimiento no válido", toast);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validations
    if (!newPassword || !confirmPassword) {
      showToast("Por favor completa todos los campos", toast);
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden", toast);
      return;
    }

    if (newPassword.length < 8) {
      showToast("La contraseña debe tener al menos 8 caracteres", toast);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      showToast("La contraseña debe tener al menos una mayúscula", toast);
      return;
    }

    if (!/\d/.test(newPassword)) {
      showToast("La contraseña debe tener al menos un número", toast);
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      showToast("La contraseña debe tener al menos un carácter especial", toast);
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.textContent = "Restableciendo...";

    try {
      const result = await resetPassword({ token, newPassword });

      if (result.success) {
        showToast("Contraseña restablecida exitosamente", toast);
        console.log("Contraseña restablecida");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showToast(result.error, toast);
      }
    } catch (error) {
      console.error("Error en reset password:", error);
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
    window.location.href = '/';
  });
}

/**
 * Displays a toast message in the UI.
 *
 * @function showToast
 * @param {string} message - The message to display.
 * @param {HTMLElement} toastEl - The toast DOM element.
 * @returns {void}
 */
function showToast(message, toastEl) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 5000);
}
