import { DASHBOARD_CONFIG } from '../config/dashboardConfig.js';

/**
 * Dashboard Utilities
 * Helper functions for dashboard operations
 */

/**
 * Gets the frontend status from backend status
 * @param {string} backendStatus - Backend status
 * @returns {string} Frontend status
 */
export const getFrontendStatus = (backendStatus) => {
  const statusMap = {
    [DASHBOARD_CONFIG.STATUSES.TODO]: DASHBOARD_CONFIG.FRONTEND_STATUSES.TODO,
    [DASHBOARD_CONFIG.STATUSES.DOING]: DASHBOARD_CONFIG.FRONTEND_STATUSES.DOING,
    [DASHBOARD_CONFIG.STATUSES.DONE]: DASHBOARD_CONFIG.FRONTEND_STATUSES.DONE
  };
  return statusMap[backendStatus] || DASHBOARD_CONFIG.FRONTEND_STATUSES.TODO;
};

/**
 * Gets the backend status from frontend status
 * @param {string} frontendStatus - Frontend status
 * @returns {string} Backend status
 */
export const getBackendStatus = (frontendStatus) => {
  const statusMap = {
    [DASHBOARD_CONFIG.FRONTEND_STATUSES.TODO]: DASHBOARD_CONFIG.STATUSES.TODO,
    [DASHBOARD_CONFIG.FRONTEND_STATUSES.DOING]: DASHBOARD_CONFIG.STATUSES.DOING,
    [DASHBOARD_CONFIG.FRONTEND_STATUSES.DONE]: DASHBOARD_CONFIG.STATUSES.DONE
  };
  return statusMap[frontendStatus] || DASHBOARD_CONFIG.STATUSES.TODO;
};

/**
 * Gets the display label for a status
 * @param {string} status - Status (frontend or backend)
 * @returns {string} Display label
 */
export const getStatusLabel = (status) => {
  return DASHBOARD_CONFIG.STATUS_LABELS[status] || status;
};

/**
 * Validates if a status is valid
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid
 */
export const isValidStatus = (status) => {
  const validStatuses = Object.values(DASHBOARD_CONFIG.STATUSES);
  return validStatuses.includes(status);
};

/**
 * Gets all valid statuses
 * @returns {Array} Array of valid statuses
 */
export const getValidStatuses = () => {
  return Object.values(DASHBOARD_CONFIG.STATUSES);
};

/**
 * Gets all frontend statuses
 * @returns {Array} Array of frontend statuses
 */
export const getFrontendStatuses = () => {
  return Object.values(DASHBOARD_CONFIG.FRONTEND_STATUSES);
};

/**
 * Creates a task element with proper attributes
 * @param {Object} task - Task object
 * @returns {HTMLElement} Task element
 */
export const createTaskElement = (task) => {
  const taskEl = document.createElement('div');
  taskEl.className = DASHBOARD_CONFIG.CLASSES.TASK_ITEM;
  taskEl.dataset.taskId = task._id || task.id;
  return taskEl;
};

/**
 * Creates a column element with proper attributes
 * @param {string} status - Column status
 * @param {string} title - Column title
 * @returns {HTMLElement} Column element
 */
export const createColumnElement = (status, title) => {
  const columnEl = document.createElement('div');
  columnEl.className = DASHBOARD_CONFIG.CLASSES.KANBAN_COLUMN;
  columnEl.setAttribute('data-status', status);

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  columnEl.appendChild(titleEl);

  const taskListEl = document.createElement('div');
  taskListEl.className = DASHBOARD_CONFIG.CLASSES.TASK_LIST;
  columnEl.appendChild(taskListEl);

  return columnEl;
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Checks if an element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Scrolls an element into view
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export const scrollIntoView = (element, options = {}) => {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  };

  element.scrollIntoView({ ...defaultOptions, ...options });
};

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Sanitizes HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Formats a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export const truncate = (str, length, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};
