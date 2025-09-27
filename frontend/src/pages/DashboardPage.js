import { logout } from "../services/authService.js";
import { handleLogout } from "../utils/authGuard.js";
import { TaskForm } from "../components/TaskForm.js";

// Import logic modules
import {
  loadTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  toggleTaskStatus,
  getAllTasks,
  setCurrentTask,
  getCurrentTask,
  showToast,
  showError,
  setupMobileSidebar,
  setupMenuItems,
  setupModalListeners,
  TaskDetailModal,
  UserProfileModal,
  TrashModal,
  AboutUsModal,
  renderKanbanBoard
} from "../logic/index.js";

/**
 * DashboardPage Component
 *
 * Main dashboard page that renders the task management interface.
 * Uses modular logic components for better organization and maintainability.
 */
export async function DashboardPage() {
  const root = document.getElementById("app");

  // === Initialize Modals ===
  const taskDetailModal = new TaskDetailModal();
  const userProfileModal = new UserProfileModal();
  const trashModal = new TrashModal();
  const aboutUsModal = new AboutUsModal();

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

          <!-- Menu Toggle -->
          <button id="menu-toggle" class="sidebar-btn" title="Alternar menú">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button> 

          <!-- close sidebar Button -->
          <button id="close-sidebar-mobile" class="mobile-menu-btn" aria-label="Cerrar menú">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

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

            <button class="menu-item" id="trash-btn" title="Papelera" tabindex="0" aria-label="Papelera">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                </svg>
              </span>
              <span class="menu-item-text">Papelera</span>
            </button>

            <button class="menu-item" id="about-us-btn" title="about-us" tabindex="0" aria-label="about-us">
                <svg fill="currentColor" width="20" height="20" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0">
                  </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                  </g><g id="SVGRepo_iconCarrier"> 
                  <path d="M1807.059 1270.091c-68.668 48.452-188.725 116.556-343.906 158.57-18.861-102.55-92.725-187.37-196.066-219.106-91.708-28.235-185.11-48.339-279.53-61.666 71.944-60.762 121.638-145.807 135.982-243.162 21.91-.791 44.837-1.243 71.04-1.243 166.023.904 331.143 26.316 490.955 75.445 72.621 22.362 121.525 87.755 121.525 162.861v128.301Zm-451.765 338.824c-114.183 80.753-330.24 198.099-621.176 198.099-129.43 0-379.144-26.203-621.177-198.1v-128.752c0-74.993 49.017-140.499 121.75-162.861 162.41-49.694 330.354-74.88 499.427-74.88h8.47c166.588.79 331.821 26.09 491.407 75.106 72.509 22.249 121.3 87.642 121.3 162.635v128.753Zm-903.53-761.901V734.072c0-155.632 126.608-282.352 282.354-282.352 155.746 0 282.353 126.72 282.353 282.352v112.942c0 155.746-126.607 282.353-282.353 282.353S451.765 1002.76 451.765 847.014Zm734.118-734.118c75.22 0 146.146 29.478 199.567 82.899 53.309 53.421 82.786 124.235 82.786 199.454V508.19c0 155.746-126.607 282.353-282.353 282.353-19.651 0-38.4-2.598-56.47-6.438v-50.033c0-156.423-92.047-290.71-224.188-354.748 8.357-148.066 130.447-266.428 280.658-266.428Zm532.857 758.061c-91.37-28.01-184.546-48.226-279.755-61.666 86.174-72.508 142.192-179.802 142.192-301.1V395.248c0-105.374-41.11-204.65-115.877-279.304-74.767-74.767-173.93-115.99-279.417-115.99-200.696 0-365.138 151.002-390.211 345.148-20.217-3.275-40.433-6.325-61.553-6.325-217.977 0-395.294 177.43-395.294 395.294v112.942c0 121.298 56.018 228.593 142.305 301.214-94.305 13.214-188.16 33.092-279.529 61.1C81.092 1246.375 0 1355.249 0 1480.163v185.675l22.588 16.941c275.238 206.344 563.803 237.177 711.53 237.177 344.244 0 593.618-148.63 711.53-237.177l22.587-16.94v-120.51c205.214-50.597 355.652-146.032 429.177-201.373l22.588-16.941V1141.79c0-125.026-80.979-233.901-201.261-270.833Z" fill-rule="evenodd">
                  </path> 
                  </g>
                </svg>             
                <span>Sobre nosotros</span>
            </button>

             <button class="menu-item" id="account-btn" title="account" tabindex="0" aria-label="Cuenta">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M5.5 21a7.5 7.5 0 0 1 13 0"></path>
                </svg>
              </span>
              <span>Mi cuenta</span>
            </button>     

          </div>
      

          <!-- Bottom Menu Items -->
          <div class="menu-items-bottom">
        
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

    <!-- User Profile Modal -->
    <div id="user-profile-modal" class="modal hidden">
      <div class="modal-content">
        <button id="close-profile" class="close-btn" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-header">
          <h2>Perfil de Usuario</h2>
        </div>

        <div id="user-profile-content">
          <div id="profile-loading" class="profile-loading">
            <div class="spinner"></div>
            <p>Cargando información del usuario...</p>
          </div>

          <div id="profile-info" class="hidden">
            <div class="profile-info-item">
              <span class="font-medium">Nombre:</span>
              <span id="profile-name">-</span>
            </div>
            <div class="profile-info-item">
              <span class="font-medium">Apellido:</span>
              <span id="profile-lastname">-</span>
            </div>
            <div class="profile-info-item">
              <span class="font-medium">Email:</span>
              <span id="profile-email">-</span>
            </div>
            <div class="profile-info-item">
              <span class="font-medium">Edad:</span>
              <span id="profile-age">-</span>
            </div>
            <div class="profile-info-item">
              <span class="font-medium">Miembro desde:</span>
              <span id="profile-created">-</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button id="edit-account-button" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar cuenta
          </button>
          <button id="delete-account-button" class="btn btn-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
            </svg>
            Eliminar cuenta
          </button>
          <button id="return" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Volver
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Account Modal -->
    <div id="edit-account-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Editar cuenta</h2>
        <div id="edit-account-form-container"></div>
      </div>
    </div>

    <!-- About Us Modal -->
    <div id="about-us-modal" class="modal hidden">
      <div class="modal-content">
        <button id="close-about-us" class="close-btn" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-header">
          <h2>Sobre nosotros</h2>
        </div>

        <div id="about-us-content">
          <!-- Content will be loaded dynamically from AboutUsPage.js -->
        </div>

        <div class="modal-actions">
          <button id="close-about-us-btn" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="delete-confirmation-modal" class="modal hidden">
      <div class="modal-content">
        <h2>¿Eliminar tarea?</h2>
        <p id="delete-confirmation-message">¿Estás seguro de que quieres eliminar esta tarea? Se moverá a la papelera.</p>
        <div class="modal-actions">
          <button id="confirm-delete" class="btn btn-danger">Sí, eliminar</button>
          <button id="cancel-delete" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Trash Modal -->
    <div id="trash-modal" class="modal hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Papelera</h2>
          <button id="close-trash" class="close-btn" aria-label="Cerrar papelera">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="trash-content">
          <div id="trash-loading" class="text-center">
            <p>Cargando papelera...</p>
          </div>
          <div id="trash-tasks" class="hidden">
            <!-- Las tareas eliminadas se cargarán aquí -->
          </div>
          <div id="trash-empty" class="hidden text-center">
            <p>La papelera está vacía</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // === Task Management ===
  const reloadTasks = async () => {
    try {
      const result = await loadTasks();
      if (result.success) {
        const tasks = getAllTasks();
        renderKanbanBoard(tasks, (task) => {
          setCurrentTask(task);
          taskDetailModal.open(task);
        });
      } else {
        showError(result.error || "Error al recargar las tareas");
      }
    } catch (err) {
      console.error("Error recargando tareas:", err);
      showError("Error de conexión al recargar tareas");
    }
  };

  // === Event Handlers ===
  const handleMenuNavigation = (itemId) => {
    switch (itemId) {
      case "tasks-btn":
        console.log("Navegando a Mis Tareas");
        break;
      case "trash-btn":
        console.log("Navegando a Papelera");
        trashModal.open();
        break;
      default:
        console.log("Navegación no implementada para:", itemId);
        break;
    }
  };

  // === Setup Event Listeners ===

  // Setup modals (after DOM is ready)
  setupModalListeners();

  // Setup mobile sidebar
  setupMobileSidebar();

  // Setup menu items
  setupMenuItems(handleMenuNavigation);

  // Setup modal-specific event listeners after DOM is ready
  setTimeout(() => {
    // User Profile Modal
    const accountBtn = document.getElementById("account-btn");
    if (accountBtn) {
      accountBtn.addEventListener("click", () => userProfileModal.open());
    }

    // User Profile Modal buttons
    const editAccountButton = document.getElementById("edit-account-button");
    if (editAccountButton) {
      editAccountButton.addEventListener("click", () => userProfileModal.openEditForm());
    }

    const returnFromUser = document.getElementById("return");
    if (returnFromUser) {
      returnFromUser.addEventListener("click", () => userProfileModal.close());
    }

    const deleteAccountButton = document.getElementById("delete-account-button");
    if (deleteAccountButton) {
      deleteAccountButton.addEventListener("click", async () => {
        const confirmDelete = confirm("¿Seguro que deseas eliminar tu cuenta?");
        if (!confirmDelete) return;
    
        const { deleteAccount, logout } = await import("../services/authService.js");
        const result = await deleteAccount();
    
        if (result.success) {
          showToast("Cuenta eliminada.");
          await handleLogout(logout);
        } else {
          showError(result.error || "No se pudo eliminar la cuenta.");
        }
      });
    }

    // About Us Modal
    const aboutUsBtn = document.getElementById("about-us-btn");
    if (aboutUsBtn) {
      aboutUsBtn.addEventListener("click", () => aboutUsModal.open());
    }

    const closeAboutUsBtn = document.getElementById("close-about-us-btn");
    if (closeAboutUsBtn) {
      closeAboutUsBtn.addEventListener("click", () => aboutUsModal.close());
    }

    // Trash Modal
    const trashBtn = document.getElementById("trash-btn");
    if (trashBtn) {
      trashBtn.addEventListener("click", () => trashModal.open());
    }

    // Task Detail Modal - setup event listeners
    taskDetailModal.setupEventListeners();

    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Modal click outside to close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }, 100);

  // Task form
  const taskForm = TaskForm(async (taskData) => {
    try {
      const result = await createNewTask(taskData);
      if (result.success) {
        document.getElementById("task-modal").classList.add("hidden");
        await reloadTasks();
        showToast("Tarea creada exitosamente");
      } else {
        showError(result.error || "Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error creando tarea:", error);
      showError("Error de conexión al crear tarea");
    }
  });
  document.getElementById("task-form-container").appendChild(taskForm);

  // FAB button
  document.getElementById("add-task-btn").addEventListener("click", () => {
    document.getElementById("task-modal").classList.remove("hidden");
  });

  // Cancel task form
  taskForm.querySelector("#cancel-task").addEventListener("click", () => {
    document.getElementById("task-modal").classList.add("hidden");
  });

  // Task detail modal buttons are now handled by the TaskDetailModal class

  // Delete confirmation
  document.getElementById("confirm-delete").addEventListener("click", async () => {
    const currentTask = getCurrentTask();
    if (currentTask) {
      const result = await deleteExistingTask(currentTask._id || currentTask.id);
      if (result.success) {
        document.getElementById("delete-confirmation-modal").classList.add("hidden");
        taskDetailModal.close();
        await reloadTasks();
        showToast("Tarea movida a la papelera");
    } else {
        showError(result.error || "Error al eliminar la tarea");
      }
    }
  });

  document.getElementById("cancel-delete").addEventListener("click", () => {
    document.getElementById("delete-confirmation-modal").classList.add("hidden");
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    document.getElementById("logout-modal").classList.remove("hidden");
  });

  document.getElementById("cancel-logout").addEventListener("click", () => {
    document.getElementById("logout-modal").classList.add("hidden");
  });

  document.getElementById("confirm-logout").addEventListener("click", async () => {
    await handleLogout(logout);
  });

  // Listen for task reload events from trash modal
  window.addEventListener('tasksReloaded', () => {
    reloadTasks();
  });

  // Load initial tasks
  await reloadTasks();
}
