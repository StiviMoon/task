import { isAuthenticated } from '../services/authService.js';

/**
* Authentication guard to protect routes
* Checks if the user is authenticated before allowing access
* @param {Function} callback - Function to execute if the user is authenticated
* @param {Function} redirectCallback - Function to execute if the user is not authenticated
* @returns {Promise<void>}
*/
export const requireAuth = async (callback, redirectCallback = null) => {
  try {
    console.log('🔒 Verificando autenticación...');
    const authenticated = await isAuthenticated();
    console.log('🔑 Estado de autenticación:', authenticated);

    if (authenticated) {
      // Authenticated user, execute callback
      console.log('✅ Usuario autenticado, acceso permitido');
      if (callback) {
        callback();
      }
    } else {
      // Unauthenticated user, redirect or execute redirect callback
      console.log('❌ Usuario no autenticado, redirigiendo...');
      if (redirectCallback) {
        redirectCallback();
      } else {
        // Default redirect to login
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.error('❌ Error verificando autenticación:', error);
    // In case of error, redirect to login
    if (redirectCallback) {
      redirectCallback();
    } else {
      window.location.href = '/';
    }
  }
};

/**
* Guard for public routes (only accessible if you are NOT authenticated)
* Redirects to the dashboard if you are already logged in
* @param {Function} callback - Function to execute if the user is NOT authenticated
* @param {Function} redirectCallback - Function to execute if the user IS authenticated
* @returns {Promise<void>}
*/
export const requireGuest = async (callback, redirectCallback = null) => {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      // Unauthenticated user, execute callback
      if (callback) {
        callback();
      }
    } else {
      // User already authenticated, redirect
      if (redirectCallback) {
        redirectCallback();
      } else {
        // Default redirect to dashboard
        window.location.href = '/tasks';
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    // On error, allow access (assume unauthenticated)
    if (callback) {
      callback();
    }
  }
};

/**
* Middleware to verify authentication with loading state
* @param {Function} callback - Function to execute if the user is authenticated
* @param {Function} loadingCallback - Function to execute while verifying authentication
* @param {Function} redirectCallback - Function to execute if the user is not authenticated
* @returns {Promise<void>}
*/
export const requireAuthWithLoading = async (callback, loadingCallback = null, redirectCallback = null) => {
  // Show loading if callback is provided
  if (loadingCallback) {
    loadingCallback();
  }

  try {
    const authenticated = await isAuthenticated();

    if (authenticated) {
      // Authenticated user, execute callback
      if (callback) {
        callback();
      }
    } else {
      // Unauthenticated user, redirect
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
* Function to handle logout and clear authentication state
* @param {Function} logoutFunction - Service logout function
* @returns {Promise<void>}
*/
export const handleLogout = async (logoutFunction) => {
  try {
    // Execute the logout function
    const result = await logoutFunction();

    if (result.success) {
      // Clear all authentication data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");

      // Redirect to login on full page reload
      window.location.href = '/';
    } else {
      console.error('Error en logout:', result.error);
      // Still clear localStorage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error en logout:', error);
    // On error, clear localStorage and redirect
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.href = '/';
  }
};
