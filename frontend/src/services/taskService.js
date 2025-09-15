import { getApiUrl, getAuthHeaders } from "../config/api.js";

/**
 * Fetches all tasks for the authenticated user
 * @async
 * @function getTasks
 * @returns {Promise<Object>} Response object with tasks list
 */
export const getTasks = async () => {
  try {
    const response = await fetch(getApiUrl("/tasks"), {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include", // Important for authentication cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener tareas");
    }

    return {
      success: true,
      data: data.tasks || [],
      message: "Tareas obtenidas exitosamente",
    };
  } catch (error) {
    console.error("Error en getTasks:", error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * Creates a new task
 * @async
 * @function createTask
 * @param {Object} taskData - Task details
 * @param {string} taskData.title - Task title
 * @param {string} taskData.details - Task details
 * @param {string} taskData.date - Task date (format YYYY-MM-DD)
 * @param {string} taskData.hour - Task time (format HH:mm)
 * @param {string} taskData.status - Task status
 * @returns {Promise<Object>} Server response
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(getApiUrl("/tasks"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
      credentials: "include", // Importante para las cookies de autenticación
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear tarea");
    }

    return {
      success: true,
      data: data,
      message: "Tarea creada exitosamente",
    };
  } catch (error) {
    console.error("Error en createTask:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Updates an existing task
 * @async
 * @function updateTask
 * @param {string} taskId - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Server response
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar tarea");
    }

    return {
      success: true,
      data: data,
      message: "Tarea actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error en updateTask:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Deletes a task
 * @async
 * @function deleteTask
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} Server response
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar tarea");
    }

    return {
      success: true,
      data: data,
      message: "Tarea eliminada exitosamente",
    };
  } catch (error) {
    console.error("Error en deleteTask:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetches a specific task by ID
 * @async
 * @function getTaskById
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} Task data
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener tarea");
    }

    return {
      success: true,
      data: data,
      message: "Tarea obtenida exitosamente",
    };
  } catch (error) {
    console.error("Error en getTaskById:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
