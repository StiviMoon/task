import page from "page";
import { renderLogin, addLoginLogic, renderForgotPassword, addForgotPasswordLogic } from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { renderResetPassword, addResetPasswordLogic } from "./pages/ResetPasswordPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { requireAuth, requireGuest } from "./utils/authGuard.js";
import { app } from "./App.js";

/**
 * Mounts a view inside the #app element.
 * Renders the given HTML template and attaches the page-specific logic.
 *
 * @param {Function} view - Function that returns an HTML string
 * @param {Function} logic - Function that attaches event listeners / page logic
 */
function mount(view, logic) {
  const appElement = document.getElementById("app");
  appElement.innerHTML = view(); // render the HTML of the page
  logic(); // attach the page-specific logic
}

/**
 * Shows a loading spinner while authentication is being verified.
 * Useful in protected routes before rendering the actual view.
 * @function
 */
const showLoading = () => {
  const appElement = document.getElementById("app");
  appElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div style="text-align: center;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto 20px;"></div>
        <p>Verificando autenticación...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
};

// ================== ROUTES ==================
/**
 * Application routes handled by Page.js
 *
 * Routes:
 * - `/` → Login page (only if guest)
 * - `/signup` → Register page (only if guest)
 * - `/forgot-password` → Forgot password page (only if guest)
 * - `/reset-password` → Reset password page (public)
 * - `/tasks` → Dashboard page (only if authenticated)
 * - `*` → Fallback route (redirects based on authentication status)
 */

/**
 * Login route ("/").
 * Accessible only if the user is not authenticated.
 */
page("/", () => {
  requireGuest(
    () => mount(renderLogin, addLoginLogic),
    () => window.location.href = '/tasks'
  );
});

/**
 * Signup route ("/signup").
 * Accessible only if the user is not authenticated.
 */
page("/signup", () => {
  requireGuest(
    () => mount(renderRegister, addRegisterLogic),
    () => window.location.href = '/tasks'
  );
});

/**
 * Forgot password route ("/forgot-password").
 * Accessible only if the user is not authenticated.
 */
page("/forgot-password", () => {
  requireGuest(
    () => mount(renderForgotPassword, addForgotPasswordLogic),
    () => window.location.href = '/tasks'
  );
});

/**
 * Reset password route ("/reset-password").
 * Accessible publicly, without authentication.
 */
page("/reset-password", () => {
  mount(renderResetPassword, addResetPasswordLogic);
});

/**
 * Dashboard route ("/tasks").
 * Accessible only if the user is authenticated.
 */
page("/tasks", () => {
  requireAuth(
    async () => {
      // Initialize the app if not already initialized
      await app.init();
    },
    () => window.location.href = '/'
  );
});

/**
 * Fallback route ("*").
 * Redirects to dashboard if authenticated, otherwise to login.
 */
page("*", () => {
  // Check if you are authenticated to decide where to redirect
  requireAuth(
    () => window.location.href = '/tasks', // If logged in → go to dashboard
    () => window.location.href = '/' // If not → go to login
  );
});

/**
 * Initializes the Page.js router.
 * This should be called once in the app entry point.
 *  * @function
 */
export function initRouter() {
  page.start();
}
