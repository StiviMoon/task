const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Crear tarea
router.post("/", taskController.createTask);

// Obtener todas las tareas del usuario autenticado
router.get("/", taskController.getTasks);

// Actualizar una tarea
router.put("/:id", taskController.updateTask);

// Eliminar una tarea
router.delete("/:id", taskController.deleteTask);

module.exports = router;
