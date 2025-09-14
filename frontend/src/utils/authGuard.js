import { isAuthenticated } from '../services/authService.js';

/**
 * Guard de autenticación para proteger rutas
 * Verifica si el usuario está autenticado antes de permitir el acceso
 * @param {Function} callback - Función a ejecutar si el usuario está autenticado
 * @param {Function} redirectCallback - Función a ejecutar si el usuario no está autenticado
 * @returns {Promise<void>}
 */
export const requireAuth = async (callback, redirectCallback = null) => {
  try {
    const authenticated = await isAuthenticated();

    if (authenticated) {
      // Usuario autenticado, ejecutar callback
      if (callback) {
        callback();
      }
    } else {
      // Usuario no autenticado, redirigir o ejecutar callback de redirección
      if (redirectCallback) {
        redirectCallback();
      } else {
        // Redirección por defecto a login
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    // En caso de error, redirigir a login
    if (redirectCallback) {
      redirectCallback();
    } else {
      window.location.href = '/';
    }
  }
};

/**
 * Guard para rutas públicas (solo accesibles si NO estás autenticado)
 * Redirige a dashboard si ya estás logueado
 * @param {Function} callback - Función a ejecutar si el usuario NO está autenticado
 * @param {Function} redirectCallback - Función a ejecutar si el usuario SÍ está autenticado
 * @returns {Promise<void>}
 */
export const requireGuest = async (callback, redirectCallback = null) => {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      // Usuario no autenticado, ejecutar callback
      if (callback) {
        callback();
      }
    } else {
      // Usuario ya autenticado, redirigir
      if (redirectCallback) {
        redirectCallback();
      } else {
        // Redirección por defecto a dashboard
        window.location.href = '/tasks';
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    // En caso de error, permitir acceso (asumir no autenticado)
    if (callback) {
      callback();
    }
  }
};

/**
 * Middleware para verificar autenticación con loading state
 * @param {Function} callback - Función a ejecutar si el usuario está autenticado
 * @param {Function} loadingCallback - Función a ejecutar mientras se verifica la autenticación
 * @param {Function} redirectCallback - Función a ejecutar si el usuario no está autenticado
 * @returns {Promise<void>}
 */
export const requireAuthWithLoading = async (callback, loadingCallback = null, redirectCallback = null) => {
  // Mostrar loading si se proporciona callback
  if (loadingCallback) {
    loadingCallback();
  }

  try {
    const authenticated = await isAuthenticated();

    if (authenticated) {
      // Usuario autenticado, ejecutar callback
      if (callback) {
        callback();
      }
    } else {
      // Usuario no autenticado, redirigir
      if (redirectCallback) {
        redirectCallback();
      } else {
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    if (redirectCallback) {
      redirectCallback();
    } else {
      window.location.href = '/';
    }
  }
};

/**
 * Función para manejar el logout y limpiar el estado de autenticación
 * @param {Function} logoutFunction - Función de logout del servicio
 * @returns {Promise<void>}
 */
export const handleLogout = async (logoutFunction) => {
  try {
    // Ejecutar la función de logout
    const result = await logoutFunction();

    if (result.success) {
      // Limpiar todos los datos de autenticación del localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");

      // Redirigir al login con recarga completa de la página
      window.location.href = '/';
    } else {
      console.error('Error en logout:', result.error);
      // Aún así, limpiar localStorage y redirigir
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error en logout:', error);
    // En caso de error, limpiar localStorage y redirigir
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.href = '/';
  }
};
