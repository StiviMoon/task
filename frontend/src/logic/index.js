/**
 * Logic Modules Index
 * Centralized exports for all logic modules
 */

// Task Logic
export {
  loadTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  toggleTaskStatus,
  getAllTasks,
  getTaskById,
  setCurrentTask,
  getCurrentTask,
  clearCurrentTask,
  mapBackendToFrontendStatus,
  mapFrontendToBackendStatus,
  getTasksByStatus,
  getTaskCountByStatus,
  validateTaskData
} from './taskLogic.js';

// UI Logic
export {
  showToast,
  showError,
  formatDate,
  formatDateForInput,
  formatHourForInput,
  getStatusLabel,
  isMobile,
  hasOpenModal,
  closeMobileSidebar,
  toggleSidebar,
  setupMobileSidebar,
  setupMenuItems
} from './uiLogic.js';

// Modal Logic
export {
  openModal,
  closeModal,
  closeCurrentModal,
  setupModalListeners,
  TaskDetailModal,
  UserProfileModal,
  TrashModal,
} from './modalLogic.js';

// Render Logic
export {
  renderTask,
  renderAllTasks,
  updateTaskCounts,
  renderKanbanBoard,
  renderEmptyColumn,
  renderLoadingColumn,
  renderErrorColumn,
  clearAllColumns,
  renderTaskDetail,
  renderTaskEditForm
} from './renderLogic.js';
