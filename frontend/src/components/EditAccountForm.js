/**
 * Renders and initializes the "Edit Account" form.
 *
 * The form includes fields for:
 * - Names (required)
 * - Surnames (required)
 * - Age (required, must be at least 13 years old)
 * - Email (required, validated with a simplified RFC 5322 regex)
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // RFC 5322 simplificado

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

      // Mail validation
      if (!emailRegex.test(email.value)) {
        document.getElementById("error-email").textContent = "⚠ Correo electrónico inválido";
        valid = false;
      } else {
        document.getElementById("error-email").textContent = "";
      }

      saveBtn.disabled = !valid;
      return valid;
    }

    [names, surnames, age, email].forEach(input =>
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
