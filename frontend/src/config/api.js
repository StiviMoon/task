// API Configuration
const API_CONFIG = {
  // Base URL del backend local (cambiar a producción cuando sea necesario)
  BASE_URL: 'http://localhost:5000/api',

  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Task endpoints (usando RESTful conventions)
    TASKS: '/tasks',
    CREATE_TASK: '/tasks',
    GET_TASKS: '/tasks',

    // Health check
    HEALTH: '/health'
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers for authenticated requests
export const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Try to get token from localStorage as fallback
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export default API_CONFIG;
