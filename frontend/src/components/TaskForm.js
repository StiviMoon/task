// src/components/TaskForm.js
import { createTask } from "../services/taskService.js";

/*
 Creates and returns a task form with real-time validation.

This form includes fields for title, detail, date, time, and status.
Upon submission, attempts to create a new task using `createTask` and executes
the `onTaskCreated` callback if provided.

@function TaskForm
@param {function(Object):void} [onTaskCreated] - Callback opcional que se ejecuta
After the task has been successfully created,
it receives the created task as an argument.
 
@returns {HTMLFormElement}The task creation form is ready to be 
inserted into the DOM.
 
 @example
 import { TaskForm } from "./components/TaskForm.js";
 
 const container = document.getElementById("app");
 const form = TaskForm((task) => {
  console.log("Tarea creada:", task);
});
container.appendChild(form);
 */
export function TaskForm(onTaskCreated) {
  const form = document.createElement("form");
  form.id = "task-form";
  form.innerHTML = `
    <label>
      Título *
      <input type="text" id="title" maxlength="50" required aria-describedby="title-error">
      <span id="title-error" class="error" aria-live="polite"></span>
    </label>
    <label>
      Detalle
      <textarea id="detail" maxlength="500"></textarea>
    </label>
    <label>
      Fecha *
      <input type="date" id="date" required aria-describedby="date-error">
      <span id="date-error" class="error" aria-live="polite"></span>
    </label>
    <label>
      Hora *
      <input type="time" id="time" required aria-describedby="time-error">
      <span id="time-error" class="error" aria-live="polite"></span>
    </label>
    <label>
      Estado *
      <select id="status" required aria-describedby="status-error">
        <option value="">Seleccione</option>
        <option value="todo">Por hacer</option>
        <option value="doing">Haciendo</option>
        <option value="done">Hecho</option>
      </select>
      <span id="status-error" class="error" aria-live="polite"></span>
    </label>
    <div class="modal-actions">
      <button type="submit" id="save-task" disabled>Guardar</button>
      <button type="button" id="cancel-task">Cancelar</button>
    </div>
    <div id="spinner" class="hidden">⏳ Guardando...</div>
  `;

  const saveBtn = form.querySelector("#save-task");
  const spinner = form.querySelector("#spinner");

/*
Input event to validate required fields in real time.
Enables or disables the save button based on the state of the fields.
@event input
*/

  form.addEventListener("input", () => {
    const title = form.querySelector("#title").value.trim();
    const date = form.querySelector("#date").value;
    const time = form.querySelector("#time").value;
    const status = form.querySelector("#status").value;

    saveBtn.disabled = !(title && date && time && status);
  });
/*
`submit` event that creates a new task when the form is submitted.

@event submit
@property {Object} newTask - Details of the new task.
@property {string} newTask.title -Title of the task.
@property {string} newTask.detail - Details of the task.
@property {string} newTask.date - Date in ISO format (yyyy-mm-dd).
@property {string} newTask.time - Time in HH:mm format.
@property {"todo"|"doing"|"done"} newTask.status - Status of the task.
*/
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTask = {
      title: form.querySelector("#title").value.trim(),
      detail: form.querySelector("#detail").value.trim(),
      date: form.querySelector("#date").value,
      time: form.querySelector("#time").value,
      status: form.querySelector("#status").value,
    };

    saveBtn.disabled = true;
    spinner.classList.remove("hidden");

    try {
      const createdTask = await createTask(newTask);
      spinner.classList.add("hidden");
      form.reset();
      saveBtn.disabled = true;

      if (onTaskCreated) onTaskCreated(createdTask);
    } catch (err) {
      spinner.classList.add("hidden");
      alert("No pudimos guardar tu tarea, inténtalo de nuevo");
      console.error("Error creando tarea:", err);
      saveBtn.disabled = false;
    }
  });

  return form;
}
