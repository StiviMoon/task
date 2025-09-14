// src/components/TaskForm.js

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
      <textarea id="details" maxlength="500" rows="2" cols="50" placeholder="Describe los detalles de tu tarea..."></textarea>
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
    const status = form.querySelector("#status").value;

    saveBtn.disabled = !(title && date && status);
  });

  // Submit new task
  form.addEventListener("submit", async (e) => {
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
