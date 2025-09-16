import { getTasks, createTask } from "../services/taskService.js";
import { logout } from "../services/authService.js";
import { handleLogout } from "../utils/authGuard.js";
import { TaskForm } from "../components/TaskForm.js";
import { renderEditAccountForm } from "../components/EditAccountForm.js";

export async function DashboardPage() {
  const root = document.getElementById("app");

  // === Main render ===
  root.innerHTML = `
    <!-- Overlay for mobile -->
    <div id="sidebar-overlay" class="sidebar-overlay"></div>

    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="sidebar-logo"></div>
          <h3 class="sidebar-title">Timely</h3>
        </div>

        <!-- Menu Toggle -->
        <button id="menu-toggle" class="sidebar-btn" title="Alternar menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Sidebar Menu -->
        <nav id="sidebar-menu" class="sidebar-menu">
          <!-- Main Menu Items -->
          <div class="menu-items-top">
            <button class="menu-item active" id="tasks-btn" title="Gestionar tareas" tabindex="0" aria-label="Mis Tareas">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,10 8,9"></polyline>
                </svg>
              </span>
              <span class="menu-item-text">Mis Tareas</span>
            </button>
          </div>

          <!-- Bottom Menu Items -->
          <div class="menu-items-bottom">
            <button class="menu-item" id="account-btn" title="Cuenta" tabindex="0" aria-label="Cuenta">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M5.5 21a7.5 7.5 0 0 1 13 0"></path>
                </svg>
              </span>
              <span>MI cuenta</span>
            </button>


            <button class="menu-item" id="logout-btn" title="Cerrar sesión" tabindex="0" aria-label="Cerrar sesión">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <!-- Main Header -->
        <header class="main-header">
          <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Abrir menú">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
           <h1>Mis Tareas</h1>
          <div class="header-actions">
            <!-- Aquí puedes añadir más acciones del header si necesitas -->
          </div>
        </header>

        <div class="kanban-board" id="kanban-board">
          <div class="kanban-column" data-status="todo">
            <h3>Pendientes</h3>
            <div class="task-list"></div>
          </div>
          <div class="kanban-column" data-status="doing">
            <h3>En progreso</h3>
            <div class="task-list"></div>
          </div>
          <div class="kanban-column" data-status="done">
            <h3>Completadas</h3>
            <div class="task-list"></div>
          </div>
        </div>
      </main>
    </div>

    <!-- FAB -->
    <button class="fab" id="add-task-btn">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <!-- Create Task Modal -->
    <div id="task-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Nueva Tarea</h2>
        <div id="task-form-container"></div>
      </div>
    </div>

    <!-- Modal Detail Task -->
    <div id="task-detail-modal" class="modal hidden">
      <div class="modal-content">
        <button id="close-detail" class="close-btn" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Vista de Solo Lectura -->
        <div id="task-view-mode">
          <h2 id="detail-title"></h2>
          <p id="detail-description"></p>
          <div class="task-info-grid">
            <div class="info-item">
              <strong>Estado:</strong>
              <span id="detail-status" class="status-badge"></span>
            </div>
            <div class="info-item">
              <strong>Fecha:</strong>
              <span id="detail-date"></span>
            </div>
            <div class="info-item">
              <strong>Hora:</strong>
              <span id="detail-time"></span>
            </div>
          </div>

          <div class="modal-actions">
            <button id="edit-task-btn" class="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar
            </button>
            <button id="toggle-status-btn" class="btn btn-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <span id="toggle-status-text">Marcar Completada</span>
            </button>
            <button id="delete-task-btn" class="btn btn-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
              </svg>
              Eliminar
            </button>
          </div>
        </div>

        <!-- Modo de Edición -->
        <div id="task-edit-mode" class="hidden">
          <h2>Editar Tarea</h2>
          <form id="edit-task-form">
            <label>
              Título *
              <input type="text" id="edit-title" maxlength="50" required>
            </label>
            <label>
              Detalles
              <textarea id="edit-details" maxlength="500" rows="3" placeholder="Describe los detalles de tu tarea..."></textarea>
            </label>
            <label>
              Fecha *
              <input type="date" id="edit-date" required>
            </label>
            <label>
              Hora
              <input type="time" id="edit-hour">
            </label>
            <label>
              Estado *
              <select id="edit-status" required>
                <option value="Por hacer">Por hacer</option>
                <option value="Haciendo">Haciendo</option>
                <option value="Hecho">Hecho</option>
              </select>
            </label>

            <div class="modal-actions">
              <button type="submit" id="save-edit-btn" class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Guardar Cambios
              </button>
              <button type="button" id="cancel-edit-btn" class="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Logout -->
    <div id="logout-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Cerrar sesión</h2>
        <p>¿Seguro que deseas cerrar sesión?</p>
        <div class="modal-actions">
          <button id="confirm-logout" class="btn btn-danger">Sí, cerrar sesión</button>
          <button id="cancel-logout" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>


    <div id="user-profile-modal" class="modal hidden">
      <div class="modal-content">

        <!-- Información de usuario -->
        <h2 class="text-xl font-semibold mb-4">Perfil de Usuario</h2>
        
        <div class="space-y-2">
          <p><span class="font-medium">Nombre:</span> Juan Pérez</p>
          <p><span class="font-medium">Apellido:</span> García</p>
          <p><span class="font-medium">Email:</span> juan.perez@example.com</p>
          <p><span class="font-medium">Miembro desde:</span> 12/03/2023</p>
        </div>

        <!-- Botones -->
        <div class="modal-actions">
          <button id="edit-account-button" class="btn btn-primary">
            Editar cuenta
          </button>
          <button class="btn btn-danger">
            Eliminar
          </button>
          <button id="return" class="btn btn-secondary">Volver</button>
        </div>

      </div>
    </div>


     <! -- Modal Edit Account -->
    <div id="edit-account-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Editar cuenta</h2>
        <div id="edit-account-form-container"></div>
      </div>
    </div>
  `;

  // === Helpers ===
  function mapStatus(status) {
    const map = { todo: "Pendiente", doing: "En progreso", done: "Hecho" };
    return map[status] || "Desconocido";
  }

  function renderTask(task) {
    // Mapear estados del backend a los del frontend
    const statusMap = {
      "Por hacer": "todo",
      Haciendo: "doing",
      Hecho: "done",
    };

    const frontendStatus = statusMap[task.status] || "todo";
    const column = document.querySelector(
      `[data-status="${frontendStatus}"] .task-list`
    );

    if (!column) {
      console.warn(`No se encontró columna para estado: ${frontendStatus}`);
      return;
    }

    const taskEl = document.createElement("div");
    taskEl.className = "task-item";
    taskEl.innerHTML = `
      <h4>${task.title}</h4>
      <small>${formatDate(task.date)} ${task.hour || ""}</small>
    `;

    taskEl.addEventListener("click", () => {
      openTaskDetailModal(task);
    });

    column.appendChild(taskEl);
  }

  function formatDate(dateString) {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Variables para el modal de detalle
  let currentTask = null;

  // Función para abrir el modal de detalle de tarea
  function openTaskDetailModal(task) {
    currentTask = task;

    // Cerrar sidebar en móvil para que se vea el modal
    closeMobileSidebar();

    // Llenar los datos en el modo de vista
    document.getElementById("detail-title").textContent = task.title;
    document.getElementById("detail-description").textContent = task.details || "Sin descripción";

    const statusBadge = document.getElementById("detail-status");
    statusBadge.textContent = task.status;
    statusBadge.setAttribute("data-status", task.status);

    document.getElementById("detail-date").textContent = formatDate(task.date);
    document.getElementById("detail-time").textContent = task.hour || "Sin hora";

    // Configurar el botón de toggle status
    updateToggleStatusButton(task.status);

    // Mostrar modo vista y ocultar modo edición
    document.getElementById("task-view-mode").classList.remove("hidden");
    document.getElementById("task-edit-mode").classList.add("hidden");

    // Mostrar el modal
    detailModal.classList.remove("hidden");
  }

  // Función para actualizar el botón de toggle status
  function updateToggleStatusButton(currentStatus) {
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

  // Función para cambiar al modo de edición
  function switchToEditMode() {
    if (!currentTask) return;

    // Llenar el formulario de edición con los datos actuales
    document.getElementById("edit-title").value = currentTask.title;
    document.getElementById("edit-details").value = currentTask.details || "";
    document.getElementById("edit-date").value = currentTask.date;
    document.getElementById("edit-hour").value = currentTask.hour || "";
    document.getElementById("edit-status").value = currentTask.status;

    // Cambiar modos
    document.getElementById("task-view-mode").classList.add("hidden");
    document.getElementById("task-edit-mode").classList.remove("hidden");
  }

  // Función para volver al modo de vista
  function switchToViewMode() {
    document.getElementById("task-edit-mode").classList.add("hidden");
    document.getElementById("task-view-mode").classList.remove("hidden");
  }

  // Función para toggle del status (placeholder para backend)
  function toggleTaskStatus() {
    if (!currentTask) return;

    const newStatus = currentTask.status === "Hecho" ? "Por hacer" : "Hecho";

    // TODO: Aquí irá la llamada al backend
    console.log(`Cambiando status de "${currentTask.title}" de "${currentTask.status}" a "${newStatus}"`);

    // Simular cambio local (temporal)
    currentTask.status = newStatus;

    // Actualizar la UI
    const statusBadge = document.getElementById("detail-status");
    statusBadge.textContent = newStatus;
    statusBadge.setAttribute("data-status", newStatus);
    updateToggleStatusButton(newStatus);

    // Mostrar mensaje temporal
    showToast(`Tarea marcada como "${newStatus}"`);
  }

  // Función para guardar edición (placeholder para backend)
  function saveTaskEdit() {
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      title: document.getElementById("edit-title").value.trim(),
      details: document.getElementById("edit-details").value.trim(),
      date: document.getElementById("edit-date").value,
      hour: document.getElementById("edit-hour").value,
      status: document.getElementById("edit-status").value
    };

    // TODO: Aquí irá la llamada al backend
    console.log("Guardando cambios:", updatedTask);

    // Simular guardado exitoso
    currentTask = updatedTask;

    // Actualizar la vista
    openTaskDetailModal(currentTask);
    showToast("Tarea actualizada exitosamente");
  }

  // Función para eliminar tarea (placeholder para backend)
  function deleteTask() {
    if (!currentTask) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${currentTask.title}"?`)) {
      // TODO: Aquí irá la llamada al backend
      console.log("Eliminando tarea:", currentTask.title);

      // Cerrar modal
      detailModal.classList.add("hidden");

      // Mostrar mensaje
      showToast("Tarea eliminada");

      // TODO: Actualizar la vista del kanban
    }
  }

  // Función para mostrar toast messages
  function showToast(message) {
    // Crear o usar toast existente
    let toast = document.getElementById("temp-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "temp-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.remove("hidden");

    // Auto-hide después de 3 segundos
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  // === Task modals ===
  const taskModal = document.getElementById("task-modal");
  const detailModal = document.getElementById("task-detail-modal");

  const addTaskBtn = document.getElementById("add-task-btn");
  const formContainer = document.getElementById("task-form-container");
  const closeDetailBtn = document.getElementById("close-detail");

  // Load and render tasks
  try {
    const result = await getTasks();
    if (result.success && result.data) {
      result.data.forEach(renderTask);
    } else {
      console.error("Error cargando tareas:", result.error);
      showError("Error al cargar las tareas");
    }
  } catch (err) {
    console.error("Error cargando tareas:", err);
    showError("Error de conexión al cargar tareas");
  }

  // Assemble form
  const taskForm = TaskForm(async (taskData) => {
    try {
      const result = await createTask(taskData);
      if (result.success) {
        taskModal.classList.add("hidden");
        // Recargar todas las tareas para mostrar la nueva
        location.reload();
      } else {
        showError(result.error || "Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error creando tarea:", error);
      showError("Error de conexión al crear tarea");
    }
  });
  formContainer.appendChild(taskForm);

  // Modal events
  addTaskBtn.addEventListener("click", () => {
    // Cerrar sidebar en móvil para que se vea el modal
    closeMobileSidebar();

    // Abrir modal de nueva tarea
    taskModal.classList.remove("hidden");
  });
  taskForm
    .querySelector("#cancel-task")
    .addEventListener("click", () => taskModal.classList.add("hidden"));
  closeDetailBtn.addEventListener("click", () =>
    detailModal.classList.add("hidden")
  );

  // Event listeners para los botones del modal de detalle
  document.getElementById("edit-task-btn").addEventListener("click", switchToEditMode);
  document.getElementById("toggle-status-btn").addEventListener("click", toggleTaskStatus);
  document.getElementById("delete-task-btn").addEventListener("click", deleteTask);

  // Event listeners para el modo de edición
  document.getElementById("cancel-edit-btn").addEventListener("click", switchToViewMode);
  document.getElementById("edit-task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveTaskEdit();
  });

  // === Sidebar Logic ===
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");
  const sidebarMenu = document.getElementById("sidebar-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const menuItems = document.querySelectorAll(".menu-item:not(#logout-btn)");


  // Toggle sidebar functionality
  const toggleSidebar = () => {
    if (isMobile()) {
      // En móvil: mostrar/ocultar sidebar con overlay
      sidebar.classList.toggle("mobile-open");
      sidebarOverlay.classList.toggle("active");
    } else {
      // En desktop: colapsar/expandir sidebar
      sidebarMenu.classList.toggle("hidden");
    }
  };

  // Cerrar sidebar en móvil
  const closeMobileSidebar = () => {
    if (isMobile()) {
      sidebar.classList.remove("mobile-open");
      sidebarOverlay.classList.remove("active");
    }
  };

  // Mejorar el overlay para que también cierre cuando hay modales abiertos
  const isMobile = () => window.innerWidth <= 768;

  // Función para verificar si hay algún modal abierto
  const hasOpenModal = () => {
    const modals = document.querySelectorAll('.modal:not(.hidden)');
    return modals.length > 0;
  };

  // Event listeners
  menuToggle.addEventListener("click", toggleSidebar);
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleSidebar);
  }
  sidebarOverlay.addEventListener("click", closeMobileSidebar);

  // Manejar items del menú (incluyendo todos los nuevos)
  const allMenuItems = document.querySelectorAll(".menu-item:not(#logout-btn)");

  allMenuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Remover clase active de todos los items
      allMenuItems.forEach((i) => i.classList.remove("active"));
      // Añadir clase active al item clickeado
      e.currentTarget.classList.add("active");

      // Cerrar sidebar en móvil después de seleccionar
      closeMobileSidebar();

      // Aquí puedes añadir la lógica para cambiar de vista
      const itemId = e.currentTarget.id;
      handleMenuNavigation(itemId);
    });

    // Añadir soporte para navegación con teclado
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Función para manejar navegación del menú
  const handleMenuNavigation = (itemId) => {
    switch (itemId) {
      case "tasks-btn":
        console.log("Navegando a Mis Tareas");
        // Ya estamos en tareas, no hacer nada
        break;
      default:
        console.log("Navegación no implementada para:", itemId);
        break;
    }
  };


  // Manejar redimensionamiento de ventana
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      // Si cambiamos a desktop, remover clases de móvil
      sidebar.classList.remove("mobile-open");
      sidebarOverlay.classList.remove("active");
    }
  });


  // === edit account ===
  const AccountBtn = document.getElementById("account-btn");
  const AccountModal = document.getElementById("user-profile-modal");
  const editAccountButton = document.getElementById("edit-account-button");
  const returnFromUser = document.getElementById("return");
  
  AccountBtn.addEventListener("click", () => {
    
    // Cerrar sidebar en móvil para que se vea el modal

    closeMobileSidebar();
    
    // Abrir modal de editar cuenta
    
    AccountModal.classList.remove("hidden");
    editAccountButton.addEventListener("click", () => {

      AccountModal.classList.add("hidden");

      editaccount();
      AccountModal.classList.remove("hidden");
    })

    returnFromUser.addEventListener("click", () => AccountModal.classList.add("hidden"));
  });
  
const editaccount = () => {
  const editAccountForm = document.getElementById("edit-account-modal");
  const editAccountFormContainer = document.getElementById("edit-account-form-container");

  // Cerrar modal de perfil de usuario
  AccountModal.classList.add("hidden");
  // Abrir modal de editar cuenta
  editAccountForm.classList.remove("hidden"); 
  // Renderizar el formulario de editar cuenta
  
  editAccountFormContainer.innerHTML = renderEditAccountForm();
  editAccountFormContainer
  .querySelector("#cancel-edit")
  .addEventListener("click", () => editAccountForm.classList.add("hidden"));

}


  // === Logout ===
  const logoutBtn = document.getElementById("logout-btn");
  const logoutModal = document.getElementById("logout-modal");
  const confirmLogout = document.getElementById("confirm-logout");
  const cancelLogout = document.getElementById("cancel-logout");

  logoutBtn.addEventListener("click", () => {
    // Cerrar sidebar en móvil para que se vea el modal
    closeMobileSidebar();

    // Abrir modal de logout
    logoutModal.classList.remove("hidden");
  });
  cancelLogout.addEventListener("click", () =>
    logoutModal.classList.add("hidden")
  );

  confirmLogout.addEventListener("click", async () => {
    // Usar la función handleLogout que maneja todo el proceso
    await handleLogout(logout);
  });

  // Helper function to show errors
  function showError(message) {
    // Crear o actualizar elemento de error
    let errorEl = document.getElementById("dashboard-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.id = "dashboard-error";
      errorEl.className = "error-message";
      document.body.appendChild(errorEl);
    }

    errorEl.textContent = message;
    errorEl.classList.remove("hidden");

    // Auto-hide después de 5 segundos
    setTimeout(() => {
      if (errorEl) {
        errorEl.classList.add("hidden");
      }
    }, 5000);
  }
}
