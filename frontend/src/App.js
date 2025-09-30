import { Sidebar } from "./components/Sidebar.js";
import { DashboardPage } from "./pages/DashboardPage.js";

/**
 * Main Application Class
 * 
 * Manages the overall application lifecycle, including:
 * - Rendering and initializing the persistent sidebar
 * - Loading and navigating between pages
 * - Keeping track of the current active page
 *
 * @class
 */
export class App {
  constructor() {
    /**
     * Sidebar component instance (persistent across pages).
     * @type {Sidebar}
     */
    this.sidebar = new Sidebar();
    /**
     * Currently active page component.
     * @type {HTMLElement | null}
     */
    this.currentPage = null;
    /**
     * Flag indicating whether the app has been initialized.
     * @type {boolean}
     */

    this.initialized = false;
  }

  /**
   * Initialize the application.
   * 
   * - Renders the sidebar (persistent UI component).
   * - Initializes the sidebar logic.
   * - Loads the default page (`tasks`).
   *
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) return;

    const root = document.getElementById("app");

    // Render sidebar first (persistent)
    root.innerHTML = this.sidebar.render();

    // Initialize sidebar
    await this.sidebar.initialize();

    // Load initial page
    await this.loadPage("tasks");

    this.initialized = true;
  }

  /**
   * Loads a specific page by name.
   * 
   * - Removes any existing page content (keeps sidebar intact).
   * - Updates the active menu item in the sidebar.
   * - Renders the requested page component.
   *
   * @async
   * @param {string} pageName - The name of the page to load (e.g., `"tasks"`, `"about"`).
   * @returns {Promise<void>}
   */
  async loadPage(pageName) {
    const root = document.getElementById("app");

    // Remove existing page content (but keep sidebar)
    const existingPage = root.querySelector('.dashboard-container, .page-content');
    if (existingPage) {
      existingPage.remove();
    }

    // Update active menu item
    this.sidebar.updateActiveMenuItem(`${pageName}-btn`);

    // Load the requested page
    switch (pageName) {
      case "tasks":
        this.currentPage = await DashboardPage();
        break;
      case "about":
        // You can add other pages here
        break;
      default:
        console.warn("Unknown page:", pageName);
        break;
    }
  }

  /**
   * Navigates to a specific page.
   * 
   * Shorthand for calling {@link App#loadPage}.
   *
   * @param {string} pageName - The name of the page to navigate to.
   */
  navigateToPage(pageName) {
    this.loadPage(pageName);
  }
}

/**
 * Singleton instance of the App class.
 * 
 * Ensures that the application has only one global instance managing state and navigation.
 *
 * @type {App}
 */
export const app = new App();

/**
 * Global event listener for navigation.
 * 
 * Listens for custom `navigateToPage` events and triggers navigation accordingly.
 * 
 * @event navigateToPage
 * @property {Object} detail - Event detail object
 * @property {string} detail.page - Target page name
 */
window.addEventListener('navigateToPage', (event) => {
  app.navigateToPage(event.detail.page);
});
