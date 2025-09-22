import { mapBackendToFrontendStatus, getAllTasks, getTaskCountByStatus } from "./taskLogic.js";
import { formatDate } from "./uiLogic.js";

/**
 * Render Logic Module
 * Handles all rendering operations for the dashboard
 */

/**
 * Renders a single task element inside the Kanban board
 * @param {Object} task - Task object to render
 * @param {Function} onTaskClick - Callback function when task is clicked
 */
export const renderTask = (task, onTaskClick) => {
  const frontendStatus = mapBackendToFrontendStatus(task.status);
  const column = document.querySelector(`[data-status="${frontendStatus}"] .task-list`);

  if (!column) {
    console.warn(`No se encontró columna para estado: ${frontendStatus}`);
    return;
  }

  const taskEl = document.createElement("div");
  taskEl.className = "task-item";
  taskEl.dataset.taskId = task._id || task.id;
  taskEl.innerHTML = `
    <h4>${task.title}</h4>
    <small>${formatDate(task.date)} ${task.hour || ""}</small>
  `;

  // Handle click to open modal
  taskEl.addEventListener("click", (e) => {
    onTaskClick(task);
  });

  column.appendChild(taskEl);
};

/**
 * Renders all tasks in the Kanban board
 * @param {Array} tasks - Array of tasks to render
 * @param {Function} onTaskClick - Callback function when task is clicked
 */
export const renderAllTasks = (tasks, onTaskClick) => {
  // Clear existing tasks
  document.querySelectorAll('.task-list').forEach(list => {
    list.innerHTML = '';
  });

  // Render each task
  tasks.forEach(task => renderTask(task, onTaskClick));
};

/**
 * Updates task counts in column headers
 * @param {Array} tasks - Array of tasks to count
 */
export const updateTaskCounts = (tasks) => {
  const statuses = ['Por hacer', 'Haciendo', 'Hecho'];

  statuses.forEach(status => {
    const count = tasks.filter(task => task.status === status).length;
    const frontendStatus = mapBackendToFrontendStatus(status);
    const counter = document.querySelector(`[data-status="${frontendStatus}"] .task-count`);

    if (counter) {
      counter.textContent = count;
    }
  });
};

/**
 * Renders the Kanban board with tasks
 * @param {Array} tasks - Array of tasks to render
 * @param {Function} onTaskClick - Callback function when task is clicked
 */
export const renderKanbanBoard = (tasks, onTaskClick) => {
  renderAllTasks(tasks, onTaskClick);
  updateTaskCounts(tasks);
};

/**
 * Renders empty state for a column
 * @param {string} status - Column status
 * @param {string} message - Empty state message
 */
export const renderEmptyColumn = (status, message) => {
  const frontendStatus = mapBackendToFrontendStatus(status);
  const column = document.querySelector(`[data-status="${frontendStatus}"] .task-list`);

  if (column) {
    column.innerHTML = `<div class="empty-column">${message}</div>`;
  }
};

/**
 * Renders loading state for a column
 * @param {string} status - Column status
 */
export const renderLoadingColumn = (status) => {
  const frontendStatus = mapBackendToFrontendStatus(status);
  const column = document.querySelector(`[data-status="${frontendStatus}"] .task-list`);

  if (column) {
    column.innerHTML = `<div class="loading-column">Cargando tareas...</div>`;
  }
};

/**
 * Renders error state for a column
 * @param {string} status - Column status
 * @param {string} error - Error message
 */
export const renderErrorColumn = (status, error) => {
  const frontendStatus = mapBackendToFrontendStatus(status);
  const column = document.querySelector(`[data-status="${frontendStatus}"] .task-list`);

  if (column) {
    column.innerHTML = `<div class="error-column">Error: ${error}</div>`;
  }
};

/**
 * Clears all task columns
 */
export const clearAllColumns = () => {
  document.querySelectorAll('.task-list').forEach(list => {
    list.innerHTML = '';
  });
};

/**
 * Renders task detail modal content
 * @param {Object} task - Task object to display
 */
export const renderTaskDetail = (task) => {
  document.getElementById("detail-title").textContent = task.title;
  document.getElementById("detail-description").textContent = task.details || "Sin descripción";

  const statusBadge = document.getElementById("detail-status");
  statusBadge.textContent = task.status;
  statusBadge.setAttribute("data-status", task.status);

  document.getElementById("detail-date").textContent = formatDate(task.date);
  document.getElementById("detail-time").textContent = task.hour || "Sin hora";
};

/**
 * Renders task edit form
 * @param {Object} task - Task object to edit
 */
export const renderTaskEditForm = (task) => {
  document.getElementById("edit-title").value = task.title || "";
  document.getElementById("edit-details").value = task.details || "";
  document.getElementById("edit-date").value = formatDateForInput(task.date);
  document.getElementById("edit-hour").value = formatHourForInput(task.hour);
  document.getElementById("edit-status").value = task.status || "Por hacer";
};

/**
 * Formats a date for input field (YYYY-MM-DD)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date for input
 */
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Formats an hour for input field (HH:mm)
 * @param {string} hourString - Hour string
 * @returns {string} Formatted hour for input
 */
const formatHourForInput = (hourString) => {
  if (!hourString) return "";

  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(hourString)) {
    return hourString;
  }

  const hourDate = new Date(`2000-01-01T${hourString}`);
  if (!isNaN(hourDate.getTime())) {
    return hourDate.toTimeString().slice(0, 5);
  }

  return "";
};
