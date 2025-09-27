import { logout } from "../services/authService.js";
import { handleLogout } from "../utils/authGuard.js";

// Import logic modules
import {
  setupMobileSidebar,
  setupMenuItems,
  setupModalListeners,
  UserProfileModal,
  TrashModal
} from "../logic/index.js";

/**
 * Sidebar Component
 *
 * Independent sidebar component that persists across all pages.
 * Handles navigation and user account management.
 */
export class Sidebar {
  constructor() {
    this.userProfileModal = new UserProfileModal();
    this.trashModal = new TrashModal();
    this.isInitialized = false;
  }

  /**
   * Render the sidebar HTML
   */
  render() {
    return `
      <!-- Overlay for mobile -->
      <div id="sidebar-overlay" class="sidebar-overlay"></div>

      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="sidebar-logo"></div>
          <h3 class="sidebar-title">Timely</h3>
        </div>

        <!-- Menu Toggle -->
        <button id="menu-toggle" class="sidebar-btn" title="Alternar menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Sidebar Menu -->
        <nav id="sidebar-menu" class="sidebar-menu">
          <!-- Main Menu Items -->
          <div class="menu-items-top">
            <button class="menu-item active" id="tasks-btn" title="Gestionar tareas" tabindex="0" aria-label="Mis Tareas">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,10 8,9"></polyline>
                </svg>
              </span>
              <span class="menu-item-text">Mis Tareas</span>
            </button>

            <button class="menu-item" id="trash-btn" title="Papelera" tabindex="0" aria-label="Papelera">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                </svg>
              </span>
              <span class="menu-item-text">Papelera</span>
            </button>

            <button class="menu-item" id="account-btn" title="account" tabindex="0" aria-label="Cuenta">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M5.5 21a7.5 7.5 0 0 1 13 0"></path>
                </svg>
              </span>
              <span>MI cuenta</span>
            </button>

            <button class="menu-item" id="about-us-btn" title="about-us" tabindex="0" aria-label="about-us">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </span>
              <span class="menu-item-text">Sobre nosotros</span>
            </button>
          </div>

          <!-- Bottom Menu Items -->
          <div class="menu-items-bottom">
            <button class="menu-item" id="logout-btn" title="Cerrar sesión" tabindex="0" aria-label="Cerrar sesión">
              <span class="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>
    `;
  }

  /**
   * Initialize the sidebar with event listeners
   */
  async initialize() {
    if (this.isInitialized) return;

    // Setup modals
    setupModalListeners();

    // Setup mobile sidebar
    setupMobileSidebar();

    // Setup menu items with navigation handler
    setupMenuItems(this.handleMenuNavigation.bind(this));

    // Setup modal-specific event listeners
    setTimeout(() => {
      this.setupEventListeners();
    }, 100);

    this.isInitialized = true;
  }

  /**
   * Handle menu navigation
   */
  handleMenuNavigation(itemId) {
    console.log("Navigation clicked:", itemId); // Debug log
    switch (itemId) {
      case "tasks-btn":
        this.navigateToPage("tasks");
        break;
      case "trash-btn":
        this.trashModal.open();
        break;
      case "about-us-btn":
        console.log("About us clicked!"); // Debug log
        this.navigateToPage("about");
        break;
      default:
        console.log("Navegación no implementada para:", itemId);
        break;
    }
  }

  /**
   * Navigate to a specific page
   */
  navigateToPage(page) {
    // Dispatch custom event for page navigation
    window.dispatchEvent(new CustomEvent('navigateToPage', {
      detail: { page }
    }));
  }

  /**
   * Setup event listeners for modals and buttons
   */
  setupEventListeners() {
    // User Profile Modal
    const accountBtn = document.getElementById("account-btn");
    if (accountBtn) {
      accountBtn.addEventListener("click", () => this.userProfileModal.open());
    }

    // User Profile Modal buttons
    const editAccountButton = document.getElementById("edit-account-button");
    if (editAccountButton) {
      editAccountButton.addEventListener("click", () => this.userProfileModal.openEditForm());
    }

    const returnFromUser = document.getElementById("return");
    if (returnFromUser) {
      returnFromUser.addEventListener("click", () => this.userProfileModal.close());
    }

    const deleteAccountButton = document.getElementById("delete-account-button");
    if (deleteAccountButton) {
      deleteAccountButton.addEventListener("click", () => {
        // TODO: Implement delete account functionality
        alert("Funcionalidad de eliminar cuenta no implementada aún");
      });
    }

    // Trash Modal
    const trashBtn = document.getElementById("trash-btn");
    if (trashBtn) {
      trashBtn.addEventListener("click", () => this.trashModal.open());
    }

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        document.getElementById("logout-modal").classList.remove("hidden");
      });
    }

    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Modal click outside to close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }

  /**
   * Update active menu item
   */
  updateActiveMenuItem(activeId) {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // Add active class to the specified item
    const activeItem = document.getElementById(activeId);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    // Remove event listeners if needed
    this.isInitialized = false;
  }
}
