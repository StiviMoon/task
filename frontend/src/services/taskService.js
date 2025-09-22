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
* Create a new task
* @param {Object} taskData - Task data
* @param {string} taskData.title - Task title
* @param {string} taskData.details - Task details
* @param {string} taskData.date - Task date (YYYY-MM-DD format)
* @param {string} taskData.hour - Task time (HH:mm format)
* @param {string} taskData.status - Task status
* @returns {Promise<Object>} Server response
*/
export const createTask = async (taskData) => {
  try {
    const response = await fetch(getApiUrl("/tasks"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
      credentials: "include", // Important for authentication cookies
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
    console.log(`Updating task ${taskId} with data:`, taskData);

    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
      credentials: "include",
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

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

/**
 * Gets all deleted tasks for the authenticated user (trash)
 * @returns {Promise<Object>} List of deleted tasks
 */
export const getDeletedTasks = async () => {
  try {
    const response = await fetch(getApiUrl("/tasks/deleted"), {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener tareas eliminadas");
    }

    return {
      success: true,
      data: data.tasks || [],
      message: "Tareas eliminadas obtenidas exitosamente",
    };
  } catch (error) {
    console.error("Error en getDeletedTasks:", error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * Restores a deleted task from trash
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} Server response
 */
export const restoreTask = async (taskId) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}/restore`), {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al restaurar tarea");
    }

    return {
      success: true,
      data: data,
      message: "Tarea restaurada exitosamente",
    };
  } catch (error) {
    console.error("Error en restoreTask:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Permanently deletes a task from trash
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} Server response
 */
export const permanentlyDeleteTask = async (taskId) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}/permanent`), {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar permanentemente");
    }

    return {
      success: true,
      data: data,
      message: "Tarea eliminada permanentemente",
    };
  } catch (error) {
    console.error("Error en permanentlyDeleteTask:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
