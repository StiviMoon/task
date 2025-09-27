import { getApiUrl, getAuthHeaders } from "../config/api.js";

/**
* Registers a new user in the system
* @param {Object} userData - User data
* @param {string} userData.name - User's first name
* @param {string} userData.lastName - User's last name
* @param {number} userData.age - User's age
* @param {string} userData.email - User's email
* @param {string} userData.password - User's password
* @returns {Promise<Object>} Server response
*/
export const register = async (userData) => {
  try {
    const response = await fetch(getApiUrl("/users/register"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
      credentials: "include", // Important for cookies
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
* Log in to the system
* @param {Object} credentials - Login credentials
* @param {string} credentials.email - User's email
* @param {string} credentials.password - User's password
* @returns {Promise<Object>} Server response
*/
export const login = async (credentials) => {
  try {
    console.log('🔄 Intentando login con URL:', getApiUrl("/users/login"));

    const response = await fetch(getApiUrl("/users/login"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
      credentials: "include", // Important for cookies
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

    // Save token to localStorage as backup
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
    console.error("URL utilizada:", getApiUrl("/users/login"));

    return {
      success: false,
      error: error.message || "Error de conexión con el servidor",
    };
  }
};

/**
* Logs out the user
* @returns {Promise<Object>} Server response
*/
export const logout = async () => {
  try {
    const response = await fetch(getApiUrl("/users/logout"), {
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
* Requests a password reset
* @param {string} email - User's email
* @returns {Promise<Object>} Server response
*/
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(getApiUrl("/users/forgot-password"), {
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
* Resets the password with a token
* @param {Object} resetData - Data to reset the password to
* @param {string} resetData.token - Reset token
* @param {string} resetData.newPassword - New password
* @returns {Promise<Object>} Server response
*/
export const resetPassword = async (resetData) => {
  try {
    const response = await fetch(getApiUrl("/users/reset-password"), {
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
* Checks if the user is authenticated
* @returns {Promise<boolean>} True if authenticated
*/
export const isAuthenticated = async () => {
  try {
    console.log('🔄 Verificando autenticación...');

    // Try with cookies first
    let response = await fetch(getApiUrl("/users/verify"), {
      method: "GET",
      credentials: "include",
    });

    console.log('📡 Respuesta verificación (cookies):', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Autenticado con cookies');
      return data.success === true;
    }

    // If cookies fail, try with localStorage token
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('🔄 Intentando con token localStorage...');

      response = await fetch(getApiUrl("/users/verify"), {
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

/**
 * Obtiene el perfil del usuario autenticado
 * @returns {Promise<Object>} Información del usuario
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch(getApiUrl("/users/profile"), {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener perfil del usuario");
    }

    return {
      success: true,
      data: data.user,
      message: "Perfil obtenido exitosamente",
    };
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Actualiza el perfil del usuario autenticado
 * @param {Object} userData - Datos del usuario a actualizar
 * @param {string} userData.name - Nombre del usuario
 * @param {string} userData.lastName - Apellido del usuario
 * @param {number} userData.age - Edad del usuario
 * @param {string} userData.email - Email del usuario
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(getApiUrl("/users/profile"), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar perfil del usuario");
    }

    return {
      success: true,
      data: data.user,
      message: data.message || "Perfil actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error en updateUserProfile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
/**
* Delete (soft) the authenticated user
* @returns {Promise<Object>} Server response
*/
export const deleteAccount = async () => {
  try {
    const response = await fetch(getApiUrl("/users/profile"), {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar la cuenta");
    }

    return {
      success: true,
      data: data,
      message: data.message || "Cuenta eliminada",
    };
  } catch (error) {
    console.error("Error en deleteAccount:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
