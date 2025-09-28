/**
 * UI Logic Module
 * Handles all UI-related operations and DOM manipulations
 */

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, info, warning)
 */
export const showToast = (message, type = 'success') => {
  // Create or use existing toast
  let toast = document.getElementById("temp-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "temp-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  // Set type-specific styling
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.classList.remove("hidden");

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
};

/**
 * Shows an error message
 * @param {string} message - The error message to display
 */
export const showError = (message) => {
  // Create or update error element
  let errorEl = document.getElementById("dashboard-error");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "dashboard-error";
    errorEl.className = "error-message";
    document.body.appendChild(errorEl);
  }

  errorEl.textContent = message;
  errorEl.classList.remove("hidden");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (errorEl) {
      errorEl.classList.add("hidden");
    }
  }, 5000);
};

/**
 * Formats a date string into a localized Spanish format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (dd MMM yyyy) or "Sin fecha"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Sin fecha";
  
  // Using getUTCH -> Date, Month, FullYear to avoid problems with timezones
  
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  return `${day} ${months[month]} ${year}`;
};

/**
 * Formats a date for input field (YYYY-MM-DD)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date for input
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Formats an hour for input field (HH:mm)
 * @param {string} hourString - Hour string
 * @returns {string} Formatted hour for input
 */
export const formatHourForInput = (hourString) => {
  if (!hourString) return "";

  // If hour is in HH:mm format, use it directly
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(hourString)) {
    return hourString;
  }

  // If it's a different format, try to parse it
  const hourDate = new Date(`2000-01-01T${hourString}`);
  if (!isNaN(hourDate.getTime())) {
    return hourDate.toTimeString().slice(0, 5);
  }

  return "";
};

/**
 * Gets the human-readable label for a status
 * @param {string} status - Status code
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  const statusLabels = {
    'todo': 'Por hacer',
    'doing': 'En progreso',
    'done': 'Completada',
    'Por hacer': 'Por hacer',
    'Haciendo': 'En progreso',
    'Hecho': 'Completada'
  };
  return statusLabels[status] || status;
};

/**
 * Checks if the current device width should be considered mobile
 * @returns {boolean} True if window width <= 768px
 */
export const isMobile = () => window.innerWidth <= 768;

/**
 * Returns whether any modal is currently open
 * @returns {boolean} True if at least one modal is visible
 */
export const hasOpenModal = () => {
  const modals = document.querySelectorAll('.modal:not(.hidden)');
  return modals.length > 0;
};

/**
 * Closes the sidebar on mobile devices
 */
export const closeMobileSidebar = () => {
  if (isMobile()) {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
  }
};

/**
 * Toggles sidebar visibility depending on device size
 */
export const toggleSidebar = () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarMenu = document.getElementById("sidebar-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (isMobile()) {
    // On mobile: show/hide sidebar with overlay
    if (sidebar) sidebar.classList.toggle("mobile-open");
    if (sidebarOverlay) sidebarOverlay.classList.toggle("active");
  } else {
    // On desktop: collapse/expand sidebar
    if (sidebarMenu) sidebarMenu.classList.toggle("hidden");
  }
};

/**
 * Sets up mobile sidebar event listeners
 */
export const setupMobileSidebar = () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeSidebarMobile = document.getElementById("close-sidebar-mobile");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleSidebar);
  }

  if(closeSidebarMobile){
    closeSidebarMobile.addEventListener("click", closeMobileSidebar);
}
  
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
  }

  // Handle window resizing
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      // If we switch to desktop, remove mobile classes
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.classList.remove("mobile-open");
      if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    }
  });
};

/**
 * Sets up menu item event listeners
 * @param {Function} handleMenuNavigation - Function to handle menu navigation
 */
export const setupMenuItems = (handleMenuNavigation) => {
  const allMenuItems = document.querySelectorAll(".menu-item:not(#logout-btn)");

  allMenuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Remove active class from all items
      allMenuItems.forEach((i) => i.classList.remove("active"));
      // Add active class to the clicked item
      e.currentTarget.classList.add("active");

      // Close sidebar on mobile after selecting
      closeMobileSidebar();

      // Handle navigation
      const itemId = e.currentTarget.id;
      handleMenuNavigation(itemId);
    });

    // Add support for keyboard navigation
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
};
