import page from "page";
import {
  renderLogin, addLoginLogic,
  renderForgotPassword, addForgotPasswordLogic
} from "./pages/LoginPage.js";
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";

function mount(renderFn, logicFn) {
  const app = document.getElementById("app");
  app.innerHTML = renderFn ? renderFn() : "";
  if (logicFn) logicFn();
}

// ================== routes ==================
page("/", () => mount(renderLogin, addLoginLogic));
page("/signup", () => mount(renderRegister, addRegisterLogic));
page("/forgot-password", () => mount(renderForgotPassword, addForgotPasswordLogic));
page("/tasks", async () => {
  const app = document.getElementById("app");
  app.innerHTML = ""; // Limpiar contenido anterior
  await DashboardPage();
});

page.start();
