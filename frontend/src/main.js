import page from "page";
import {
  renderLogin, addLoginLogic,
  renderForgotPassword, addForgotPasswordLogic
} from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { renderResetPassword, addResetPasswordLogic } from "./pages/ResetPasswordPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { requireAuth, requireGuest } from "./utils/authGuard.js";
import "./styles/main.css";
import "./styles/components.css";
import "./styles/pages.css";

function mount(renderFn, logicFn) {
  const app = document.getElementById("app");
  app.innerHTML = renderFn ? renderFn() : "";
  if (logicFn) logicFn();
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

// ================== routes ==================

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

// Ruta de forgot password - accesible sin autenticación (para recuperar contraseña)
page("/forgot-password", () => {
  mount(renderForgotPassword, addForgotPasswordLogic);
});

// Ruta de reset password - accesible sin autenticación (para restablecer contraseña)
page("/reset-password", () => {
  mount(renderResetPassword, addResetPasswordLogic);
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
  window.location.href = '/';
});

page.start();
