import { resetPassword } from "../services/authService.js";

// ====================== RESET PASSWORD VIEW ======================

/**
 * Render the Reset Password screen template.
 * Provides input fields for new password and confirmation.
 *
 * @returns {string} HTML markup for the reset password view
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

// ====================== RESET PASSWORD LOGIC ======================

/**
 * Attach logic for the Reset Password page:
 * - Extracts token from URL
 * - Validates new password rules
 * - Calls backend to reset password
 * - Handles success, error, and UI state updates
 */
export function addResetPasswordLogic() {
  const form = document.getElementById("resetForm");
  const spinner = document.getElementById("spinner");
  const toast = document.getElementById("toast");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

   // Retrieve token from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  // If token is missing or invalid → redirect to login
  if (!token) {
    showToast("Token de restablecimiento no válido", toast);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return;
  }
  // ---------- Form Submission ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // ---------- Validation ----------   
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

    // ---------- UI State: Loading ----------
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.textContent = "Restableciendo...";

    try {
      // Call backend to reset password
      const result = await resetPassword({ token, newPassword });

      if (result.success) {
        showToast("Contraseña restablecida exitosamente", toast);
        console.log("Contraseña restablecida");

        // Redirect to login after 2s
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
      // Restore UI state
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-loading');
      submitBtn.textContent = originalBtnText;
    }
  });
  // ---------- Navigation ----------
  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = '/';
  });
}

// ====================== HELPERS ======================

/**
 * Display a temporary toast message.
 *
 * @param {string} message - Message to display
 * @param {HTMLElement} toastEl - Toast container element
 */
function showToast(message, toastEl) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 5000);
}
