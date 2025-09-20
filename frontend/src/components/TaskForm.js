/**
 * Creates and returns a task form with real-time validation.
 *
 * This form includes fields for title, details, date, time, and status.
 * Upon submission, attempts to create a new task using `createTask` and executes
 * the `onTaskCreated` callback if provided.
 * 
 * @function TaskForm
 * @param {function(Task):void} [onTaskCreated] - Optional callback executed
 * after the task has been successfully created. It receives the created task.
 *  
 * @returns {HTMLFormElement} The task creation form ready to be inserted into the DOM.
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
      Detalles
      <textarea id="details" maxlength="500" rows="2" cols="50" placeholder="Describe los detalles de tu tarea.. ( Opcional )"></textarea>
    </label>
    <label>
      Fecha *
      <input type="date" id="date" required aria-describedby="date-error">
      <span id="date-error" class="error" aria-live="polite"></span>
    </label>
    <label>
      Hora
      <input type="time" id="hour" aria-describedby="hour-error">
      <span id="hour-error" class="error" aria-live="polite"></span>
    </label>
    <label>
      Estado *
      <select id="status" required aria-describedby="status-error">
        <option value="">Seleccione</option>
        <option value="Por hacer">Por hacer</option>
        <option value="Haciendo">Haciendo</option>
        <option value="Hecho">Hecho</option>
      </select>
      <span id="status-error" class="error" aria-live="polite"></span>
    </label>
    <div class="modal-actions">
      <button type="submit" id="save-task" class="btn btn-primary" disabled>Guardar</button>
      <button type="button" id="cancel-task" class="btn btn-secondary">Cancelar</button>
    </div>
    <div id="spinner" class="hidden">Guardando...</div>
  `;

  const saveBtn = form.querySelector("#save-task");
  const spinner = form.querySelector("#spinner");

/**
   * `input` event that validates required fields in real time.
   * Enables or disables the save button based on the state of the fields.
   * 
   * @event input
   */  form.addEventListener("input", () => {
    const title = form.querySelector("#title").value.trim();
    const date = form.querySelector("#date").value;
    const status = form.querySelector("#status").value;

    saveBtn.disabled = !(title && date && status);
  });

// Submit new task
  /**
   * `submit` event that creates a new task when the form is submitted.
   *
   * @event submit
   * @property {Task} newTask - The task created from the form data.
   * @property {string} newTask.title - Title of the task.
   * @property {string} [newTask.details] - Details of the task.
   * @property {string} newTask.date - Date in ISO format (yyyy-mm-dd).
   * @property {string} [newTask.hour] - Time in HH:mm format.
   * @property {"Por hacer"|"Haciendo"|"Hecho"} newTask.status - Status of the task.
   */  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTask = {
      title: form.querySelector("#title").value.trim(),
      details: form.querySelector("#details").value.trim(),
      date: form.querySelector("#date").value,
      hour: form.querySelector("#hour").value,
      status: form.querySelector("#status").value,
    };

    saveBtn.disabled = true;
    spinner.classList.remove("hidden");

    try {
      if (onTaskCreated) {
        await onTaskCreated(newTask);
      }
      spinner.classList.add("hidden");
      form.reset();
      saveBtn.disabled = true;
    } catch (err) {
      spinner.classList.add("hidden");
      alert("No pudimos guardar tu tarea, inténtalo de nuevo");
      console.error("Error creando tarea:", err);
      saveBtn.disabled = false;
    }
  });

  return form;
}
