import { getTasks, createTask, updateTask, deleteTask as deleteTaskService, getDeletedTasks, restoreTask, permanentlyDeleteTask } from "../services/taskService.js";

/**
 * Task Logic Module
 * Handles all task-related business logic and data operations
 */

// Task state management
let tasks = [];
let currentTask = null;

/**
 * Loads all tasks from the server
 * @returns {Promise<Object>} Result object with success status and data
 */
export const loadTasks = async () => {
  try {
    const result = await getTasks();
    if (result.success && result.data) {
      tasks = result.data;
      return { success: true, data: tasks };
    } else {
      return { success: false, error: result.error || "Error al cargar las tareas" };
    }
  } catch (error) {
    console.error("Error cargando tareas:", error);
    return { success: false, error: "Error de conexión al cargar tareas" };
  }
};

/**
 * Creates a new task
 * @param {Object} taskData - Task data to create
 * @returns {Promise<Object>} Result object with success status
 */
export const createNewTask = async (taskData) => {
  try {
    const result = await createTask(taskData);
    if (result.success) {
      // Reload tasks to get the updated list
      const reloadResult = await loadTasks();
      if (reloadResult.success) {
        tasks = reloadResult.data;
      }
    }
    return result;
  } catch (error) {
    console.error("Error creando tarea:", error);
    return { success: false, error: "Error de conexión al crear tarea" };
  }
};

/**
 * Updates an existing task
 * @param {string} taskId - Task ID to update
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Result object with success status
 */
export const updateExistingTask = async (taskId, taskData) => {
  try {
    const result = await updateTask(taskId, taskData);
    if (result.success) {
      // Update local task
      const taskIndex = tasks.findIndex(t => (t._id || t.id) === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
      }
    }
    return result;
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    return { success: false, error: "Error de conexión al actualizar tarea" };
  }
};

/**
 * Deletes a task (soft delete)
 * @param {string} taskId - Task ID to delete
 * @returns {Promise<Object>} Result object with success status
 */
export const deleteExistingTask = async (taskId) => {
  try {
    const result = await deleteTaskService(taskId);
    if (result.success) {
      // Remove from local tasks
      tasks = tasks.filter(t => (t._id || t.id) !== taskId);
    }
    return result;
  } catch (error) {
    console.error("Error eliminando tarea:", error);
    return { success: false, error: "Error de conexión al eliminar tarea" };
  }
};

/**
 * Toggles task status between "Por hacer" and "Hecho"
 * @param {string} taskId - Task ID to toggle
 * @returns {Promise<Object>} Result object with success status
 */
export const toggleTaskStatus = async (taskId) => {
  const task = tasks.find(t => (t._id || t.id) === taskId);
  if (!task) {
    return { success: false, error: "Tarea no encontrada" };
  }

  const newStatus = task.status === "Hecho" ? "Por hacer" : "Hecho";
  return await updateExistingTask(taskId, { ...task, status: newStatus });
};

/**
 * Gets all tasks
 * @returns {Array} Array of tasks
 */
export const getAllTasks = () => tasks;

/**
 * Gets a specific task by ID
 * @param {string} taskId - Task ID
 * @returns {Object|null} Task object or null if not found
 */
export const getTaskById = (taskId) => {
  return tasks.find(t => (t._id || t.id) === taskId) || null;
};

/**
 * Sets the current task being viewed/edited
 * @param {Object} task - Task object
 */
export const setCurrentTask = (task) => {
  currentTask = task;
};

/**
 * Gets the current task
 * @returns {Object|null} Current task or null
 */
export const getCurrentTask = () => currentTask;

/**
 * Clears the current task
 */
export const clearCurrentTask = () => {
  currentTask = null;
};

/**
 * Maps backend status to frontend status
 * @param {string} backendStatus - Backend status
 * @returns {string} Frontend status
 */
export const mapBackendToFrontendStatus = (backendStatus) => {
  const statusMap = {
    "Por hacer": "todo",
    "Haciendo": "doing",
    "Hecho": "done",
  };
  return statusMap[backendStatus] || "todo";
};

/**
 * Maps frontend status to backend status
 * @param {string} frontendStatus - Frontend status
 * @returns {string} Backend status
 */
export const mapFrontendToBackendStatus = (frontendStatus) => {
  const statusMap = {
    "todo": "Por hacer",
    "doing": "Haciendo",
    "done": "Hecho",
  };
  return statusMap[frontendStatus] || "Por hacer";
};

/**
 * Gets tasks by status
 * @param {string} status - Task status
 * @returns {Array} Array of tasks with the specified status
 */
export const getTasksByStatus = (status) => {
  return tasks.filter(task => task.status === status);
};

/**
 * Gets task count by status
 * @param {string} status - Task status
 * @returns {number} Number of tasks with the specified status
 */
export const getTaskCountByStatus = (status) => {
  return getTasksByStatus(status).length;
};

/**
 * Validates task data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} Validation result with success status and errors
 */
export const validateTaskData = (taskData) => {
  const errors = [];

  if (!taskData.title || taskData.title.trim() === '') {
    errors.push("El título es obligatorio");
  }

  if (!taskData.date) {
    errors.push("La fecha es obligatoria");
  }

  if (!taskData.status) {
    errors.push("El estado es obligatorio");
  }

  // Validate date is not in the past
  if (taskData.date) {
    const selectedDate = new Date(taskData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.push("La fecha no puede ser en el pasado");
    }
  }

  // Validate hour format if provided
  if (taskData.hour && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(taskData.hour)) {
    errors.push("La hora debe estar en formato HH:mm");
  }

  return {
    success: errors.length === 0,
    errors: errors
  };
};
