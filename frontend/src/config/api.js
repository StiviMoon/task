// API Configuration
const API_CONFIG = {
  // Base URL del backend desplegado en Render
  BASE_URL: 'https://task-bc6l.onrender.com/api',

  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Task endpoints
    TASKS: '/tasks',
    CREATE_TASK: '/tasks/createTask',
    GET_TASKS: '/tasks/getTasks',

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
