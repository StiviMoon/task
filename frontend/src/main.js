import page from "page";
import {
  renderLogin, addLoginLogic,
  renderForgotPassword, addForgotPasswordLogic
} from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { renderResetPassword, addResetPasswordLogic } from "./pages/ResetPasswordPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { requireAuth, requireGuest } from "./utils/authGuard.js";
import "./style.css";

/**
 * Mounts a page into the #app container.
 * Calls the render function to produce the HTML,
 * then attaches the corresponding logic (event listeners, validation, etc).
 *
 * @param {Function} renderFn - Function that returns HTML string
 * @param {Function} [logicFn] - Function to attach behavior after rendering
 */

function mount(renderFn, logicFn) {
  const app = document.getElementById("app");
  app.innerHTML = renderFn ? renderFn() : "";
  if (logicFn) logicFn();
}

/**
 * Function to show loading while verifying authentication
 * Displays a loading spinner while authentication is being checked.
 * Used in protected routes before the actual content is rendered.
 */
const showLoading = () => {
  const app = document.getElementById("app");
  app.innerHTML = `
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
 * Login route ("/")
 * - Only accessible if the user is NOT authenticated.
 * - Otherwise, redirect to /tasks.
 */
page("/", () => {
  requireGuest(
    () => mount(renderLogin, addLoginLogic),
    () => window.location.href = '/tasks'
  );
});

/**
 * Signup route ("/signup")
 * - Only accessible if the user is NOT authenticated.
 * - Otherwise, redirect to /tasks.
 */
page("/signup", () => {
  requireGuest(
    () => mount(renderRegister, addRegisterLogic),
    () => window.location.href = '/tasks'
  );
});

/**
 * Forgot password route ("/forgot-password")
 * - Accessible without authentication.
 * - Allows the user to start a password recovery process.
 */
page("/forgot-password", () => {
  mount(renderForgotPassword, addForgotPasswordLogic);
});

/**
 * Reset password route ("/reset-password")
 * - Accessible without authentication.
 * - Allows the user to set a new password.
 */
page("/reset-password", () => {
  mount(renderResetPassword, addResetPasswordLogic);
});

/**
 * Dashboard route ("/tasks")
 * - Only accessible if the user IS authenticated.
 * - Otherwise, redirect to "/".
 */
page("/tasks", () => {
  requireAuth(
    async () => {
      const app = document.getElementById("app");
      app.innerHTML = ""; // Limpiar contenido anterior
      await DashboardPage();
    },
    () => window.location.href = '/'
  );
});

/**
 * Fallback route
 * - Redirects any unknown path to "/".
 */
page("*", () => {
  window.location.href = '/';
});
// Start the client-side router
page.start();
