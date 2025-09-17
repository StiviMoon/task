import page from "page";
import { renderLogin, addLoginLogic, renderForgotPassword, addForgotPasswordLogic } from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { renderResetPassword, addResetPasswordLogic } from "./pages/ResetPasswordPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { requireAuth, requireGuest } from "./utils/authGuard.js";

/**
 * Mounts a view inside the #app element.
 * Renders the given HTML template and attaches the page-specific logic.
 *
 * @param {Function} view - Function that returns an HTML string
 * @param {Function} logic - Function that attaches event listeners / page logic
 */
function mount(view, logic) {
  const app = document.getElementById("app");
  app.innerHTML = view(); // render the HTML of the page
  logic(); // attach the page-specific logic
}

/**
 * Shows a loading spinner while authentication is being verified.
 * Useful in protected routes before rendering the actual view.
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
 * "/" → Login page (solo accesible si NO estás autenticado)
 * "/signup" → Register page (solo accesible si NO estás autenticado)
 * "/forgot-password" → Forgot password page (solo accesible si NO estás autenticado)
 * "/reset-password" → Reset password page (accesible sin autenticación)
 * "/tasks" → Dashboard page (solo accesible si estás autenticado)
 */

// Ruta de login - solo accesible si NO estás autenticado
page("/", () => {
  requireGuest(
    () => mount(renderLogin, addLoginLogic),
    () => window.location.href = '/tasks'
  );
});

// Login route
page("/signup", () => {
  requireGuest(
    () => mount(renderRegister, addRegisterLogic),
    () => window.location.href = '/tasks'
  );
});

// Forgot password route
page("/forgot-password", () => {
  requireGuest(
    () => mount(renderForgotPassword, addForgotPasswordLogic),
    () => window.location.href = '/tasks'
  );
});

// Reset password route (public)
page("/reset-password", () => {
  mount(renderResetPassword, addResetPasswordLogic);
});

// Dashboard route (protected)
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

// Fallback route (handles unknown paths)
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
 */
export function initRouter() {
  page.start();
}
