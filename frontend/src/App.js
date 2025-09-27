import { Sidebar } from "./components/Sidebar.js";
import { DashboardPage } from "./pages/DashboardPage.js";

/**
 * Main Application Class
 * Manages the overall app structure and persistent components
 */
export class App {
  constructor() {
    this.sidebar = new Sidebar();
    this.currentPage = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    const root = document.getElementById("app");

    // Render sidebar first (persistent)
    root.innerHTML = this.sidebar.render();

    // Initialize sidebar
    await this.sidebar.initialize();

    // Load initial page
    await this.loadPage("tasks");
  }

  /**
   * Load a specific page
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
   * Navigate to a page
   */
  navigateToPage(pageName) {
    this.loadPage(pageName);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  await app.init();

  // Listen for navigation events
  window.addEventListener('navigateToPage', (event) => {
    app.navigateToPage(event.detail.page);
  });
});
