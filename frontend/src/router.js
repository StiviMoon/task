import page from "page";
import { renderLogin, addLoginLogic } from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { requireAuth, requireGuest } from "./utils/authGuard.js";

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

// Función para mostrar loading mientras se verifica autenticación
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
 * "/tasks" → Dashboard page (solo accesible si estás autenticado)
 */

// Ruta de login - solo accesible si NO estás autenticado
page("/", () => {
  requireGuest(
    () => mount(renderLogin, addLoginLogic),
    () => window.location.href = '/tasks'
  );
});

// Ruta de registro - solo accesible si NO estás autenticado
page("/signup", () => {
  requireGuest(
    () => mount(renderRegister, addRegisterLogic),
    () => window.location.href = '/tasks'
  );
});

// Ruta de dashboard - solo accesible si estás autenticado
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

// Redirigir cualquier ruta desconocida
page("*", () => {
  // Verificar si está autenticado para decidir a dónde redirigir
  requireAuth(
    () => window.location.href = '/tasks',
    () => window.location.href = '/'
  );
});

// Starts the Page.js router
export function initRouter() {
  page.start();
}
