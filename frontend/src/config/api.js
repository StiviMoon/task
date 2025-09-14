// API Configuration
const API_CONFIG = {
  // Base URL del backend (configurado por variables de entorno)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // App configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Task Manager',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',

  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",

    // Task endpoints (usando RESTful conventions)
    TASKS: "/tasks",
    CREATE_TASK: "/tasks",
    GET_TASKS: "/tasks",

    // Health check
    HEALTH: "/health",
  },
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

// Helper function to check if we're in development mode
export const isDevelopment = () => {
  return API_CONFIG.NODE_ENV === 'development';
};

// Helper function to check if we're in production mode
export const isProduction = () => {
  return API_CONFIG.NODE_ENV === 'production';
};

// Helper function to get current environment info
export const getEnvironmentInfo = () => {
  return {
    baseUrl: API_CONFIG.BASE_URL,
    appName: API_CONFIG.APP_NAME,
    nodeEnv: API_CONFIG.NODE_ENV,
    isDevelopment: isDevelopment(),
    isProduction: isProduction()
  };
};

export default API_CONFIG;
