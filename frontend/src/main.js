import page from "page";
import {
  renderLogin, addLoginLogic,
  renderForgotPassword, addForgotPasswordLogic
} from "./pages/LoginPage.js";
/**
* Mounts a view in the parent container (#app).
*
* @function mount
* @param {Function} [renderFn] - Function that returns the view's HTML.
* @param {Function} [logicFn] - Function that adds the view's logic and events.
* @returns {void}
*/
import { renderRegister, addRegisterLogic } from "./pages/RegisterPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";

function mount(renderFn, logicFn) {
  const app = document.getElementById("app");
  app.innerHTML = renderFn ? renderFn() : "";
  if (logicFn) logicFn();
}
 
page("/", () => mount(renderLogin, addLoginLogic));
page("/signup", () => mount(renderRegister, addRegisterLogic));
page("/forgot-password", () => mount(renderForgotPassword, addForgotPasswordLogic));
page("/tasks", () => DashboardPage());

page.start();
