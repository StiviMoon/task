import { getTasks } from "../services/taskService.js";
import { TaskForm } from "../components/TaskForm.js";

export async function DashboardPage() {
  const root = document.getElementById("app");

  // === Main render ===
  root.innerHTML = `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <button id="menu-toggle" class="sidebar-btn">☰</button>
        <nav id="sidebar-menu" class="sidebar-menu hidden">
          <button class="menu-item" id="logout-btn">Cerrar sesión</button>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <h1>Mis Tareas</h1>
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
    <button class="fab" id="add-task-btn">+</button>

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
        <button id="close-detail" class="close-btn">✖</button>
        <h2 id="detail-title"></h2>
        <p id="detail-description"></p>
        <p><strong>Estado:</strong> <span id="detail-status"></span></p>
        <p><strong>Fecha:</strong> <span id="detail-date"></span></p>
        <p><strong>Hora:</strong> <span id="detail-time"></span></p>
      </div>
    </div>

    <!-- Modal Logout -->
    <div id="logout-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Cerrar sesión</h2>
        <p>¿Seguro que deseas cerrar sesión?</p>
        <div class="modal-actions">
          <button id="confirm-logout" class="btn-danger">Sí, cerrar sesión</button>
          <button id="cancel-logout" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  `;

  // === Helpers ===
  function mapStatus(status) {
    const map = { todo: "Pendiente", doing: "En progreso", done: "Hecho" };
    return map[status] || "Desconocido";
  }

  function renderTask(task) {
    const column = document.querySelector(`[data-status="${task.status}"] .task-list`);
    const taskEl = document.createElement("div");
    taskEl.className = "task-item";
    taskEl.innerHTML = `
      <h4>${task.title}</h4>
      <small>${task.date} ${task.time}</small>
    `;

    taskEl.addEventListener("click", () => {
      document.getElementById("detail-title").textContent = task.title;
      document.getElementById("detail-description").textContent = task.detail || "Sin descripción";
      document.getElementById("detail-status").textContent = mapStatus(task.status);
      document.getElementById("detail-date").textContent = task.date;
      document.getElementById("detail-time").textContent = task.time;
      detailModal.classList.remove("hidden");
    });

    column.appendChild(taskEl);
  }

  // === Task modals ===
  const taskModal = document.getElementById("task-modal");
  const detailModal = document.getElementById("task-detail-modal");

  const addTaskBtn = document.getElementById("add-task-btn");
  const formContainer = document.getElementById("task-form-container");
  const closeDetailBtn = document.getElementById("close-detail");

  // Load and render tasks
  try {
    const tasks = await getTasks();
    tasks.forEach(renderTask);
  } catch (err) {
    console.error("Error cargando tareas:", err);
  }

  // Assemble form
  const taskForm = TaskForm((createdTask) => {
    taskModal.classList.add("hidden");
    renderTask(createdTask);
  });
  formContainer.appendChild(taskForm);

  // Modal events
  addTaskBtn.addEventListener("click", () => taskModal.classList.remove("hidden"));
  taskForm.querySelector("#cancel-task").addEventListener("click", () => taskModal.classList.add("hidden"));
  closeDetailBtn.addEventListener("click", () => detailModal.classList.add("hidden"));

  // === Sidebar ===
  const menuToggle = document.getElementById("menu-toggle");
  const sidebarMenu = document.getElementById("sidebar-menu");

  menuToggle.addEventListener("click", () => {
    sidebarMenu.classList.toggle("hidden");
  });

  // === Logout ===
  const logoutBtn = document.getElementById("logout-btn");
  const logoutModal = document.getElementById("logout-modal");
  const confirmLogout = document.getElementById("confirm-logout");
  const cancelLogout = document.getElementById("cancel-logout");

  logoutBtn.addEventListener("click", () => logoutModal.classList.remove("hidden"));
  cancelLogout.addEventListener("click", () => logoutModal.classList.add("hidden"));

  confirmLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}
