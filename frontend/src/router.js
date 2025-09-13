import page from "page";
import { renderLogin, addLoginLogic } from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";

/**
 * Mounts a view inside the #app element
 * @param {Function} view - Function that returns HTML string
 * @param {Function} logic - Function that adds event listeners / page logic
 */
function mount(view, logic) {
  const app = document.getElementById("app");
  app.innerHTML = view(); // render the HTML of the page
  logic(); // attach the page-specific logic
}

// ================== ROUTES ==================
/**
 * "/" → Login page
 * "/signup" → Register page
 * "/tasks" → Dashboard pag
 */
page("/", () => mount(renderLogin, addLoginLogic));
page("/signup", () => mount(renderRegister, addRegisterLogic));
page("/tasks", () => DashboardPage());

// Redirects any unknown route back to the login page
page("*", () => page.redirect("/"));

// Starts the Page.js router
export function initRouter() {
  page.start();
}
