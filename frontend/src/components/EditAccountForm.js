/**
 * Renders and initializes the "Edit Account" form.
 *
 * The form includes fields for:
 * - Names (required)
 * - Surnames (required)
 * - Age (required, must be at least 13 years old)
 * - Email (required, validated with a simplified RFC 5322 regex)
 * - Current password (optional, required if changing password)
 * - New password (optional, required if changing password)
 * - Confirm new password (optional, required if changing password)
 *
 * Features:
 * - Real-time validation of all fields (`input` events).
 * - Prevents form submission if validation fails.
 * - Shows a loading spinner during submission.
 * - Displays a success toast message when the process finishes.
 *
 * @function renderEditAccountForm
 * @param {Object} [user={}] - Optional user data to prefill the form (not currently applied).
 * @param {string} [user.names] - User's first names.
 * @param {string} [user.surnames] - User's last names.
 * @param {number} [user.age] - User's age.
 * @param {string} [user.email] - User's email.
 *
 * @returns {string} HTML string representing the "Edit Account" form ready to insert into the DOM.
 *
 * @example
 * // Insert the form into a container
 * document.getElementById("container").innerHTML = renderEditAccountForm();
 *
 * @event input
 * @description Triggered on form fields to perform real-time validation.
 *
 * @event submit
 * @description Prevents default submit, validates fields, shows spinner,
 *              and displays a toast notification on success.
 */
export function renderEditAccountForm(user = {}) {
  const html = `
    <form id="editAccountForm" novalidate>
      <div class="input-group">
        <input type="text" id="names" name="name" placeholder="Nombres" value="${user.name || ''}" required />
        <div class="error" id="error-names" aria-live="polite"></div>
      </div>

      <div class="input-group">
        <input type="text" id="surnames" name="lastName" placeholder="Apellidos" value="${user.lastName || ''}" required />
        <div class="error" id="error-surnames" aria-live="polite"></div>
      </div>

      <div class="input-group">
        <input type="number" id="age" name="age" placeholder="Edad" value="${user.age || ''}" required min="13" />
        <div class="error" id="error-age" aria-live="polite"></div>
      </div>

      <div class="input-group">
        <input type="email" id="email" name="email" placeholder="Correo electrónico" value="${user.email || ''}" required />
        <div class="error" id="error-email" aria-live="polite"></div>
      </div>

      <!-- Password Section -->
      <div class="password-section">
        <h3>Cambiar Contraseña</h3>
        <p class="password-help">Deja estos campos vacíos si no quieres cambiar tu contraseña</p>

        <div class="input-group">
          <div class="password-input-wrapper">
            <input type="password" id="currentPassword" name="currentPassword" placeholder="Contraseña actual" />
            <button type="button" class="password-toggle" id="toggle-current-password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div class="error" id="error-current-password" aria-live="polite"></div>
        </div>

        <div class="input-group">
          <div class="password-input-wrapper">
            <input type="password" id="newPassword" name="newPassword" placeholder="Nueva contraseña" />
            <button type="button" class="password-toggle" id="toggle-new-password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div class="error" id="error-new-password" aria-live="polite"></div>
        </div>

        <div class="input-group">
          <div class="password-input-wrapper">
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmar nueva contraseña" />
            <button type="button" class="password-toggle" id="toggle-confirm-password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div class="error" id="error-confirm-password" aria-live="polite"></div>
        </div>
      </div>

     <div class="modal-actions"> 
        <button type="submit" id="saveBtn" class="btn btn-primary" disabled>Guardar</button>
        <button type="button" id="cancel-edit" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>

    <!-- Spinner -->
    <div id="spinner" class="hidden">
      <div class="loader"></div>
    </div>

    <!-- Toast -->
    <div id="toast" class="toast hidden" role="status" aria-live="polite">✅ Perfil actualizado</div>
  `;

  setTimeout(() => {
    const form = document.getElementById("editAccountForm");
    const saveBtn = document.getElementById("saveBtn");
    const spinner = document.getElementById("spinner");
    const toast = document.getElementById("toast");

    const names = document.getElementById("names");
    const surnames = document.getElementById("surnames");
    const age = document.getElementById("age");
    const email = document.getElementById("email");
    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // RFC 5322 simplificado

    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);

        // Update icon
        const svg = toggle.querySelector('svg');
        if (type === 'text') {
          svg.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          `;
        } else {
          svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          `;
        }
      });
    });

    /**
     * Validates form fields in real time.
     *
     * @private
     * @returns {boolean} True if all fields are valid, false otherwise.
     */
    function validate() {
      let valid = true;

      // Name validation
      if (!names.value.trim()) {
        document.getElementById("error-names").textContent = "⚠ Los nombres son obligatorios";
        valid = false;
      } else {
        document.getElementById("error-names").textContent = "";
      }

      // Last name validation
      if (!surnames.value.trim()) {
        document.getElementById("error-surnames").textContent = "⚠ Los apellidos son obligatorios";
        valid = false;
      } else {
        document.getElementById("error-surnames").textContent = "";
      }

      // Age validation
      if (!age.value || parseInt(age.value, 10) < 13) {
        document.getElementById("error-age").textContent = "⚠ Debe tener al menos 13 años";
        valid = false;
      } else {
        document.getElementById("error-age").textContent = "";
      }

      // Email validation
      if (!emailRegex.test(email.value)) {
        document.getElementById("error-email").textContent = "⚠ Correo electrónico inválido";
        valid = false;
      } else {
        document.getElementById("error-email").textContent = "";
      }

      // Password validation
      const currentPasswordValue = currentPassword.value.trim();
      const newPasswordValue = newPassword.value.trim();
      const confirmPasswordValue = confirmPassword.value.trim();

      // Clear previous password errors
      document.getElementById("error-current-password").textContent = "";
      document.getElementById("error-new-password").textContent = "";
      document.getElementById("error-confirm-password").textContent = "";

      // If any password field is filled, all must be filled
      if (currentPasswordValue || newPasswordValue || confirmPasswordValue) {
        if (!currentPasswordValue) {
          document.getElementById("error-current-password").textContent = "⚠ La contraseña actual es obligatoria";
          valid = false;
        }

        if (!newPasswordValue) {
          document.getElementById("error-new-password").textContent = "⚠ La nueva contraseña es obligatoria";
          valid = false;
        } else if (newPasswordValue.length < 6) {
          document.getElementById("error-new-password").textContent = "⚠ La contraseña debe tener al menos 6 caracteres";
          valid = false;
        }

        if (!confirmPasswordValue) {
          document.getElementById("error-confirm-password").textContent = "⚠ Debe confirmar la nueva contraseña";
          valid = false;
        } else if (newPasswordValue !== confirmPasswordValue) {
          document.getElementById("error-confirm-password").textContent = "⚠ Las contraseñas no coinciden";
          valid = false;
        }
      }

      saveBtn.disabled = !valid;
      return valid;
    }

    [names, surnames, age, email, currentPassword, newPassword, confirmPassword].forEach(input =>
      input.addEventListener("input", validate)
    );

    // Submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;

      spinner.classList.remove("hidden");
      saveBtn.disabled = true;

      try {
        // Prepare user data
        const userData = {
          name: names.value.trim(),
          lastName: surnames.value.trim(),
          age: parseInt(age.value, 10),
          email: email.value.trim()
        };

        // Add password data if provided
        const currentPasswordValue = currentPassword.value.trim();
        const newPasswordValue = newPassword.value.trim();

        if (currentPasswordValue && newPasswordValue) {
          userData.currentPassword = currentPasswordValue;
          userData.newPassword = newPasswordValue;
        }

        // Import the service function dynamically to avoid circular imports
        const { updateUserProfile } = await import("../services/authService.js");

        const result = await updateUserProfile(userData);

        if (result.success) {
          // Show success message
          toast.textContent = "✅ " + result.message;
          toast.classList.remove("hidden");
          setTimeout(() => toast.classList.add("hidden"), 3000);

          // Update the profile modal with new data using global function
          if (window.updateProfileDisplay) {
            window.updateProfileDisplay(result.data);
          }

          // Clear password fields
          currentPassword.value = "";
          newPassword.value = "";
          confirmPassword.value = "";

          // Close modal after successful update
          setTimeout(() => {
            const editModal = document.getElementById("edit-account-modal");
            if (editModal) {
              editModal.classList.add("hidden");
            }
          }, 1500);
        } else {
          // Show error message
          toast.textContent = "❌ " + (result.error || "Error al actualizar perfil");
          toast.classList.remove("hidden");
          setTimeout(() => toast.classList.add("hidden"), 3000);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.textContent = "❌ Error de conexión al actualizar perfil";
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 3000);
      } finally {
        spinner.classList.add("hidden");
        saveBtn.disabled = false;
      }
    });
  });

  return html;
}
