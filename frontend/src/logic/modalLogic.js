import { getUserProfile } from "../services/authService.js";
import { getDeletedTasks, restoreTask, permanentlyDeleteTask } from "../services/taskService.js";
import { formatDate, closeMobileSidebar } from "./uiLogic.js";
import { renderEditAccountForm } from "../components/EditAccountForm.js";
import { renderAboutUs } from "../pages/AboutUsPage.js";

/**
 * Modal Logic Module
 * Handles all modal-related operations and state management
 */

// Modal state
let currentModal = null;

/**
 * Opens a modal by ID
 * @param {string} modalId - ID of the modal to open
 */
export const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    currentModal = modalId;
    closeMobileSidebar();
  }
};

/**
 * Closes a modal by ID
 * @param {string} modalId - ID of the modal to close
 */
export const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    if (currentModal === modalId) {
      currentModal = null;
    }
  }
};

/**
 * Closes the current modal
 */
export const closeCurrentModal = () => {
  if (currentModal) {
    closeModal(currentModal);
  }
};

/**
 * Sets up modal event listeners
 */
export const setupModalListeners = () => {
  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target.id);
    }
  });

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentModal) {
      closeModal(currentModal);
    }
  });

  // Setup close buttons for all modals
  const closeButtons = document.querySelectorAll('.close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = e.target.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });
};

/**
 * Task Detail Modal Logic
 */
export class TaskDetailModal {
  constructor() {
    this.currentTask = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById("close-detail");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Edit button
    const editBtn = document.getElementById("edit-task-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => this.switchToEditMode());
    }

    // Cancel edit button
    const cancelEditBtn = document.getElementById("cancel-edit-btn");
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => this.switchToViewMode());
    }

    // Edit form submission
    const editForm = document.getElementById("edit-task-form");
    if (editForm) {
      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveEdit();
      });
    }

    // Toggle status button
    const toggleStatusBtn = document.getElementById("toggle-status-btn");
    if (toggleStatusBtn) {
      toggleStatusBtn.addEventListener("click", () => this.toggleStatus());
    }

    // Delete button
    const deleteBtn = document.getElementById("delete-task-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this.showDeleteConfirmation());
    }
  }

  open(task) {
    this.currentTask = task;
    this.fillViewMode(task);
    this.switchToViewMode();
    openModal("task-detail-modal");
  }

  close() {
    closeModal("task-detail-modal");
    this.currentTask = null;
  }

  fillViewMode(task) {
    document.getElementById("detail-title").textContent = task.title;
    document.getElementById("detail-description").textContent = task.details || "Sin descripción";

    const statusBadge = document.getElementById("detail-status");
    statusBadge.textContent = task.status;
    statusBadge.setAttribute("data-status", task.status);

    document.getElementById("detail-date").textContent = formatDate(task.date);
    document.getElementById("detail-time").textContent = task.hour || "Sin hora";

    this.updateToggleStatusButton(task.status);
  }

  switchToEditMode() {
    if (!this.currentTask) return;

    // Fill the edit form with current data
    document.getElementById("edit-title").value = this.currentTask.title || "";
    document.getElementById("edit-details").value = this.currentTask.details || "";
    document.getElementById("edit-date").value = this.formatDateForInput(this.currentTask.date);
    document.getElementById("edit-hour").value = this.formatHourForInput(this.currentTask.hour);
    document.getElementById("edit-status").value = this.currentTask.status || "Por hacer";

    // Switch modes
    document.getElementById("task-view-mode").classList.add("hidden");
    document.getElementById("task-edit-mode").classList.remove("hidden");
  }

  switchToViewMode() {
    document.getElementById("task-edit-mode").classList.add("hidden");
    document.getElementById("task-view-mode").classList.remove("hidden");
  }

  updateToggleStatusButton(currentStatus) {
    const toggleBtn = document.getElementById("toggle-status-btn");
    const toggleText = document.getElementById("toggle-status-text");

    if (currentStatus === "Hecho") {
      toggleBtn.className = "btn btn-warning";
      toggleText.textContent = "Marcar Pendiente";
      toggleBtn.querySelector("svg").innerHTML = `
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      `;
    } else {
      toggleBtn.className = "btn btn-success";
      toggleText.textContent = "Marcar Completada";
      toggleBtn.querySelector("svg").innerHTML = `
        <polyline points="20,6 9,17 4,12"></polyline>
      `;
    }
  }

  formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  formatHourForInput(hourString) {
    if (!hourString) return "";

    if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(hourString)) {
      return hourString;
    }

    const hourDate = new Date(`2000-01-01T${hourString}`);
    if (!isNaN(hourDate.getTime())) {
      return hourDate.toTimeString().slice(0, 5);
    }

    return "";
  }

  getCurrentTask() {
    return this.currentTask;
  }

  setCurrentTask(task) {
    this.currentTask = task;
  }

  async toggleStatus() {
    if (!this.currentTask) return;

    const newStatus = this.currentTask.status === "Hecho" ? "Por hacer" : "Hecho";

    try {
      // Import the update function dynamically to avoid circular imports
      const { updateExistingTask } = await import('./taskLogic.js');
      const result = await updateExistingTask(this.currentTask._id || this.currentTask.id, {
        ...this.currentTask,
        status: newStatus
      });

      if (result.success) {
        this.currentTask.status = newStatus;
        this.updateToggleStatusButton(newStatus);

        // Update the view
        const statusBadge = document.getElementById("detail-status");
        if (statusBadge) {
          statusBadge.textContent = newStatus;
          statusBadge.setAttribute("data-status", newStatus);
        }

        // Show success message
        const { showToast } = await import('./uiLogic.js');
        showToast(`Tarea marcada como "${newStatus}"`);

        // Close the modal automatically
        this.close();

        // Trigger task reload
        window.dispatchEvent(new CustomEvent('tasksReloaded'));
      } else {
        const { showError } = await import('./uiLogic.js');
        showError(result.error || "Error al actualizar el estado de la tarea");
      }
    } catch (error) {
      console.error("Error actualizando estado de tarea:", error);
      const { showError } = await import('./uiLogic.js');
      showError("Error de conexión al actualizar tarea");
    }
  }

  showDeleteConfirmation() {
    if (!this.currentTask) return;

    const messageEl = document.getElementById("delete-confirmation-message");
    if (messageEl) {
      messageEl.textContent = `¿Estás seguro de que quieres eliminar la tarea "${this.currentTask.title}"? Se moverá a la papelera.`;
    }

    const confirmModal = document.getElementById("delete-confirmation-modal");
    if (confirmModal) {
      confirmModal.classList.remove("hidden");
    }
  }

  async saveEdit() {
    if (!this.currentTask) return;

    // Get form values
    const title = document.getElementById("edit-title").value.trim();
    const details = document.getElementById("edit-details").value.trim();
    const date = document.getElementById("edit-date").value;
    const hour = document.getElementById("edit-hour").value;
    const status = document.getElementById("edit-status").value;

    // Validate required fields
    if (!title) {
      const { showError } = await import('./uiLogic.js');
      showError("El título es obligatorio");
      return;
    }

    if (!date) {
      const { showError } = await import('./uiLogic.js');
      showError("La fecha es obligatoria");
      return;
    }

    if (!status) {
      const { showError } = await import('./uiLogic.js');
      showError("El estado es obligatorio");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      const { showError } = await import('./uiLogic.js');
      showError("La fecha no puede ser en el pasado");
      return;
    }

    // Validate hour format if provided
    if (hour && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(hour)) {
      const { showError } = await import('./uiLogic.js');
      showError("La hora debe estar en formato HH:mm");
      return;
    }

    const updatedTask = {
      title,
      details,
      date,
      hour: hour || null,
      status
    };

    try {
      const { updateExistingTask } = await import('./taskLogic.js');
      const result = await updateExistingTask(this.currentTask._id || this.currentTask.id, updatedTask);

      if (result.success) {
        // Update local task
        this.currentTask = { ...this.currentTask, ...updatedTask };

        // Show success message
        const { showToast } = await import('./uiLogic.js');
        showToast("Tarea actualizada exitosamente");

        // Close the modal automatically
        this.close();

        // Trigger task reload
        window.dispatchEvent(new CustomEvent('tasksReloaded'));
      } else {
        const { showError } = await import('./uiLogic.js');
        showError(result.error || "Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      const { showError } = await import('./uiLogic.js');
      showError("Error de conexión al actualizar tarea");
    }
  }
}

/**
 * User Profile Modal Logic
 */
export class UserProfileModal {
  constructor() {
    // Event listeners will be set up externally
  }

  async open() {
    closeMobileSidebar();
    await this.loadUserProfile();
    openModal("user-profile-modal");
  }

  close() {
    closeModal("user-profile-modal");
  }

  async loadUserProfile() {
    const loadingEl = document.getElementById("profile-loading");
    const profileInfoEl = document.getElementById("profile-info");

    try {
      // Show loading state
      loadingEl.classList.remove("hidden");
      profileInfoEl.classList.add("hidden");

      const result = await getUserProfile();

      if (result.success && result.data) {
        this.updateProfileDisplay(result.data);
        loadingEl.classList.add("hidden");
        profileInfoEl.classList.remove("hidden");
      } else {
        throw new Error(result.error || "Error al cargar perfil del usuario");
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      loadingEl.innerHTML = `
        <div class="profile-error">
          <p>Error: ${error.message}</p>
          <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 10px;">
            Reintentar
          </button>
        </div>
      `;
    }
  }

  updateProfileDisplay(user) {
    document.getElementById("profile-name").textContent = user.name || "-";
    document.getElementById("profile-lastname").textContent = user.lastName || "-";
    document.getElementById("profile-email").textContent = user.email || "-";
    document.getElementById("profile-age").textContent = user.age || "-";

    if (user.createdAt) {
      const createdDate = new Date(user.createdAt);
      const formattedDate = createdDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      document.getElementById("profile-created").textContent = formattedDate;
    } else {
      document.getElementById("profile-created").textContent = "-";
    }
  }

  async openEditForm() {
    const editAccountForm = document.getElementById("edit-account-modal");
    const editAccountFormContainer = document.getElementById("edit-account-form-container");

    this.close();
    openModal("edit-account-modal");

    // Show loading state
    editAccountFormContainer.innerHTML = `
      <div class="profile-loading">
        <div class="spinner"></div>
        <p>Cargando formulario de edición...</p>
      </div>
    `;

    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        editAccountFormContainer.innerHTML = renderEditAccountForm(result.data);
        this.setupEditFormListeners();
      } else {
        editAccountFormContainer.innerHTML = `
          <div class="profile-error">
            <p>Error al cargar datos del usuario</p>
            <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 10px;">
              Reintentar
            </button>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error loading user data for edit form:", error);
      editAccountFormContainer.innerHTML = `
        <div class="profile-error">
          <p>Error: ${error.message}</p>
          <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 10px;">
            Reintentar
          </button>
        </div>
      `;
    }
  }

  setupEditFormListeners() {
    const editAccountFormContainer = document.getElementById("edit-account-form-container");

    // Setup cancel button
    const cancelBtn = editAccountFormContainer.querySelector("#cancel-edit");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        closeModal("edit-account-modal");
        this.open(); // Return to profile view
      });
    }

    // Setup form submission
    const form = editAccountFormContainer.querySelector("form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.saveUserProfile(form);
      });
    }
  }

  async saveUserProfile(form) {
    const formData = new FormData(form);
    const userData = {
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      age: parseInt(formData.get("age")) || null
    };

    // Validate required fields
    if (!userData.name || !userData.lastName || !userData.email) {
      const { showError } = await import('./uiLogic.js');
      showError("Todos los campos son obligatorios");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      const { showError } = await import('./uiLogic.js');
      showError("El formato del email no es válido");
      return;
    }

    // Validate age
    if (userData.age && (userData.age < 1 || userData.age > 120)) {
      const { showError } = await import('./uiLogic.js');
      showError("La edad debe estar entre 1 y 120 años");
      return;
    }

    try {
      const { updateUserProfile } = await import('../services/authService.js');
      const result = await updateUserProfile(userData);

      if (result.success) {
        const { showToast } = await import('./uiLogic.js');
        showToast("Perfil actualizado exitosamente");

        // Close edit modal and return to profile
        closeModal("edit-account-modal");

        // Reload profile data
        await this.loadUserProfile();
        this.open();
      } else {
        const { showError } = await import('./uiLogic.js');
        showError(result.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      const { showError } = await import('./uiLogic.js');
      showError("Error de conexión al actualizar perfil");
    }
  }
}

/**
 * Trash Modal Logic
 */
export class TrashModal {
  constructor() {
    // Event listeners will be set up externally
  }

  open() {
    closeMobileSidebar();
    this.loadTrashTasks();
    openModal("trash-modal");
  }

  close() {
    closeModal("trash-modal");
  }

  async loadTrashTasks() {
    const loadingEl = document.getElementById("trash-loading");
    const tasksEl = document.getElementById("trash-tasks");
    const emptyEl = document.getElementById("trash-empty");

    try {
      loadingEl.classList.remove("hidden");
      tasksEl.classList.add("hidden");
      emptyEl.classList.add("hidden");

      const result = await getDeletedTasks();

      if (result.success && result.data) {
        if (result.data.length > 0) {
          this.renderTrashTasks(result.data, tasksEl);
          tasksEl.classList.remove("hidden");
        } else {
          emptyEl.classList.remove("hidden");
        }
      } else {
        throw new Error(result.error || "Error al cargar papelera");
      }
    } catch (error) {
      console.error("Error cargando papelera:", error);
      loadingEl.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    } finally {
      loadingEl.classList.add("hidden");
    }
  }

  renderTrashTasks(tasks, container) {
    container.innerHTML = tasks.map(task => `
      <div class="trash-task-item" data-task-id="${task._id || task.id}">
        <div class="task-info">
          <h4>${task.title}</h4>
          <p>${task.details || "Sin descripción"}</p>
          <small>Eliminada: ${formatDate(task.updatedAt)}</small>
        </div>
      </div>
    `).join('');
  }
}
