import page from "page";
import { renderLogin, addLoginLogic } from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";

/**
 * Mounts a view inside the #app element.
 * 
 * @param {Function|null} view - Function that returns an HTML string (or null if nothing to render).
 * @param {Function|null} logic - Function that adds event listeners / page logic (optional).
 */

function mount(view, logic) {
  const app = document.getElementById("app");
  app.innerHTML = view(); // render the HTML of the page
  logic(); // attach the page-specific logic
}

/**
 * Application routes.
 * @route "/" - Login page
 * @route "/signup" - Register page
 * @route "/tasks" - Dashboard page
 */
page("/", () => mount(renderLogin, addLoginLogic));
page("/signup", () => mount(renderRegister, addRegisterLogic));
page("/tasks", () => DashboardPage());

/**
 * Redirects any unknown route back to the login page.
 */page("*", () => page.redirect("/"));

/**
 * Initializes the client-side router using Page.js.
 * Starts listening for route changes.
 * @function
 */export function initRouter() {
  page.start();
}
