import { getApiUrl, getAuthHeaders } from '../config/api.js';

/**
 * Obtiene todas las tareas del usuario autenticado
 * @returns {Promise<Object>} Lista de tareas
 */
export const getTasks = async () => {
  try {
    const response = await fetch(getApiUrl('/tasks'), {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include' // Importante para las cookies de autenticación
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener tareas');
    }

    return {
      success: true,
      data: data.tasks || [],
      message: 'Tareas obtenidas exitosamente'
    };
  } catch (error) {
    console.error('Error en getTasks:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Crea una nueva tarea
 * @param {Object} taskData - Datos de la tarea
 * @param {string} taskData.title - Título de la tarea
 * @param {string} taskData.details - Detalles de la tarea
 * @param {string} taskData.date - Fecha de la tarea (formato YYYY-MM-DD)
 * @param {string} taskData.hour - Hora de la tarea (formato HH:mm)
 * @param {string} taskData.status - Estado de la tarea
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(getApiUrl('/tasks'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
      credentials: 'include' // Importante para las cookies de autenticación
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear tarea');
    }

    return {
      success: true,
      data: data,
      message: 'Tarea creada exitosamente'
    };
  } catch (error) {
    console.error('Error en createTask:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Actualiza una tarea existente
 * @param {string} taskId - ID de la tarea
 * @param {Object} taskData - Datos actualizados de la tarea
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar tarea');
    }

    return {
      success: true,
      data: data,
      message: 'Tarea actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error en updateTask:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Elimina una tarea
 * @param {string} taskId - ID de la tarea
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar tarea');
    }

    return {
      success: true,
      data: data,
      message: 'Tarea eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error en deleteTask:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtiene una tarea específica por ID
 * @param {string} taskId - ID de la tarea
 * @returns {Promise<Object>} Datos de la tarea
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener tarea');
    }

    return {
      success: true,
      data: data,
      message: 'Tarea obtenida exitosamente'
    };
  } catch (error) {
    console.error('Error en getTaskById:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
