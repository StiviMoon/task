const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");


// Crear tarea
router.post("/createTask", taskController.createTask);

// Obtener todas las tareas del usuario autenticado
router.get("/getTasks", taskController.getTasks);

module.exports = router;