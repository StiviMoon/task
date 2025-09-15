import { getApiUrl, getAuthHeaders } from "../config/api.js";

/**
 * Registers a new user in the system.
 *
 * @async
 * @function register
 * @param {Object} userData - User data.
 * @param {string} userData.name - User's first name.
 * @param {string} userData.lastName - User's last name.
 * @param {number} userData.age - User's age.
 * @param {string} userData.email - User's email.
 * @param {string} userData.password - User's password.
 * @returns {Promise<Object>} Server response containing success, data, or error.
 */
export const register = async (userData) => {
  try {
    const response = await fetch(getApiUrl("/auth/register"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
      credentials: "include", // Importante para las cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar usuario");
    }

    return {
      success: true,
      data: data,
      message: "Usuario registrado exitosamente",
    };
  } catch (error) {
    console.error("Error en register:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Logs a user into the system.
 *
 * @async
 * @function login
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's password.
 * @returns {Promise<Object>} Server response containing success, data, or error.
 */
export const login = async (credentials) => {
  try {
    console.log('🔄 Intentando login con URL:', getApiUrl("/auth/login"));

    const response = await fetch(getApiUrl("/auth/login"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
      credentials: "include", // Importante para las cookies
    });

    console.log('📡 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Login exitoso:', data);

    // Save token in localStorage as a backup
    if (data.token) {
      localStorage.setItem('access_token', data.token);
    }

    return {
      success: true,
      data: data,
      message: "Inicio de sesión exitoso",
    };
  } catch (error) {
    console.error("❌ Error en login:", error);
    console.error("URL utilizada:", getApiUrl("/auth/login"));

    return {
      success: false,
      error: error.message || "Error de conexión con el servidor",
    };
  }
};

/**
 * Logs out the current user.
 *
 * @async
 * @function logout
 * @returns {Promise<Object>} Server response containing success, data, or error.
 */
export const logout = async () => {
  try {
    const response = await fetch(getApiUrl("/auth/logout"), {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al cerrar sesión");
    }

    return {
      success: true,
      data: data,
      message: "Sesión cerrada exitosamente",
    };
  } catch (error) {
    console.error("Error en logout:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Requests a password reset email.
 *
 * @async
 * @function forgotPassword
 * @param {string} email - User's email.
 * @returns {Promise<Object>} Server response containing success, data, or error.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(getApiUrl("/auth/forgot-password"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al solicitar restablecimiento");
    }

    return {
      success: true,
      data: data,
      message:
        "Si el correo existe, se ha enviado un enlace de restablecimiento",
    };
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Resets the user's password with a token.
 *
 * @async
 * @function resetPassword
 * @param {Object} resetData - Reset data.
 * @param {string} resetData.token - Reset token.
 * @param {string} resetData.newPassword - New password.
 * @returns {Promise<Object>} Server response containing success, data, or error.
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await fetch(getApiUrl("/auth/reset-password"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(resetData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al restablecer contraseña");
    }

    return {
      success: true,
      data: data,
      message: "Contraseña restablecida exitosamente",
    };
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Checks if the user is currently authenticated.
 *
 * @async
 * @function isAuthenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise.
 */
export const isAuthenticated = async () => {
  try {
    console.log('🔄 Verificando autenticación...');

    // Primero intentar con cookies
    let response = await fetch(getApiUrl("/auth/verify"), {
      method: "GET",
      credentials: "include",
    });

    console.log('📡 Respuesta verificación (cookies):', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Autenticado con cookies');
      return data.success === true;
    }

    // Si falla con cookies, intentar con token de localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('🔄 Intentando con token localStorage...');

      response = await fetch(getApiUrl("/auth/verify"), {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });

      console.log('📡 Respuesta verificación (localStorage):', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Autenticado con localStorage token');
        return data.success === true;
      }
    }

    console.log('❌ No autenticado');
    return false;
  } catch (error) {
    console.error("❌ Error verificando autenticación:", error);
    return false;
  }
};
