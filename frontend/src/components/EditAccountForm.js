export function renderEditAccountForm(user = {}) {
  const html = `
    <form id="editAccountForm" novalidate>
      <div class="input-group">
        <input type="text" id="names" placeholder="Nombres"  required />
        <div class="error" id="error-names" aria-live="polite"></div>
      </div>

      <div class="input-group">
        <input type="text" id="surnames" placeholder="Apellidos" required />
        <div class="error" id="error-surnames" aria-live="polite"></div>
      </div>

      <div class="input-group">
        <input type="number" id="age" placeholder="Edad"  required min="13" />
        <div class="error" id="error-age" aria-live="polite"></div>
      </div>

      <div class="input-group">
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <div class="error" id="error-email" aria-live="polite"></div>
      </div>
      
      <button type="submit" id="saveBtn" class="btn btn-primary" disabled>Guardar</button>
      <button type="button" id="cancel-edit" class="btn btn-secondary">Cancelar</button>
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

    function validate() {
      let valid = true;

      // Validación de nombres
      if (!names.value.trim()) {
        document.getElementById("error-names").textContent = "⚠ Los nombres son obligatorios";
        valid = false;
      } else {
        document.getElementById("error-names").textContent = "";
      }

      // Validación de apellidos
      if (!surnames.value.trim()) {
        document.getElementById("error-surnames").textContent = "⚠ Los apellidos son obligatorios";
        valid = false;
      } else {
        document.getElementById("error-surnames").textContent = "";
      }

      // Validación de edad
      if (!age.value || parseInt(age.value, 10) < 13) {
        document.getElementById("error-age").textContent = "⚠ Debe tener al menos 13 años";
        valid = false;
      } else {
        document.getElementById("error-age").textContent = "";
      }

      // Validación de correo
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
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;

      spinner.classList.remove("hidden");
      saveBtn.disabled = true;

      // Simular procesamiento
      setTimeout(() => {
        spinner.classList.add("hidden");
        saveBtn.disabled = false;

        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 3000);
      }, 2000);
    });
  });

  return html;
}
