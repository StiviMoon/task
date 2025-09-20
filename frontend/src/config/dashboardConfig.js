/**
 * Dashboard Configuration
 * Centralized configuration for the dashboard component
 */

export const DASHBOARD_CONFIG = {
  // Task statuses
  STATUSES: {
    TODO: 'Por hacer',
    DOING: 'Haciendo',
    DONE: 'Hecho'
  },

  // Frontend status mapping
  FRONTEND_STATUSES: {
    TODO: 'todo',
    DOING: 'doing',
    DONE: 'done'
  },

  // Status labels
  STATUS_LABELS: {
    'todo': 'Pendientes',
    'doing': 'En progreso',
    'done': 'Completadas',
    'Por hacer': 'Pendientes',
    'Haciendo': 'En progreso',
    'Hecho': 'Completadas'
  },

  // Modal IDs
  MODALS: {
    TASK: 'task-modal',
    TASK_DETAIL: 'task-detail-modal',
    USER_PROFILE: 'user-profile-modal',
    EDIT_ACCOUNT: 'edit-account-modal',
    ABOUT_US: 'about-us-modal',
    DELETE_CONFIRMATION: 'delete-confirmation-modal',
    TRASH: 'trash-modal',
    LOGOUT: 'logout-modal'
  },

  // Element IDs
  ELEMENTS: {
    SIDEBAR: 'sidebar',
    SIDEBAR_MENU: 'sidebar-menu',
    SIDEBAR_OVERLAY: 'sidebar-overlay',
    MOBILE_MENU_BTN: 'mobile-menu-btn',
    MENU_TOGGLE: 'menu-toggle',
    KANBAN_BOARD: 'kanban-board',
    ADD_TASK_BTN: 'add-task-btn',
    TASK_FORM_CONTAINER: 'task-form-container'
  },

  // CSS Classes
  CLASSES: {
    HIDDEN: 'hidden',
    ACTIVE: 'active',
    MOBILE_OPEN: 'mobile-open',
    TASK_ITEM: 'task-item',
    TASK_LIST: 'task-list',
    KANBAN_COLUMN: 'kanban-column',
    MODAL: 'modal',
    MODAL_CONTENT: 'modal-content'
  },

  // Messages
  MESSAGES: {
    LOADING_TASKS: 'Cargando tareas...',
    ERROR_LOADING_TASKS: 'Error al cargar las tareas',
    ERROR_CONNECTION: 'Error de conexión',
    TASK_CREATED: 'Tarea creada exitosamente',
    TASK_UPDATED: 'Tarea actualizada exitosamente',
    TASK_DELETED: 'Tarea movida a la papelera',
    TASK_RESTORED: 'Tarea restaurada exitosamente',
    TASK_PERMANENTLY_DELETED: 'Tarea eliminada permanentemente',
    STATUS_UPDATED: 'Estado de tarea actualizado',
    CONFIRM_DELETE: '¿Estás seguro de que quieres eliminar esta tarea? Se moverá a la papelera.',
    CONFIRM_LOGOUT: '¿Seguro que deseas cerrar sesión?',
    CONFIRM_PERMANENT_DELETE: '¿Estás seguro de que quieres eliminar permanentemente esta tarea? Esta acción no se puede deshacer.'
  },

  // Validation rules
  VALIDATION: {
    TITLE_MAX_LENGTH: 50,
    DETAILS_MAX_LENGTH: 500,
    HOUR_REGEX: /^([01]\d|2[0-3]):([0-5]\d)$/
  },

  // Timing
  TIMING: {
    TOAST_DURATION: 3000,
    ERROR_DURATION: 5000
  }
};

export default DASHBOARD_CONFIG;
