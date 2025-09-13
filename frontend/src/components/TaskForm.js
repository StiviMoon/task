// src/components/TaskForm.js
import { createTask } from "../services/taskService.js";

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

  // Real-time validation
  form.addEventListener("input", () => {
    const title = form.querySelector("#title").value.trim();
    const date = form.querySelector("#date").value;
    const time = form.querySelector("#time").value;
    const status = form.querySelector("#status").value;

    saveBtn.disabled = !(title && date && time && status);
  });

  // Submit new task
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
