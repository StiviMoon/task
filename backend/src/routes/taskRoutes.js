const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// CRUD básico de tareas
router.post("/", taskController.createTask);           // CREATE
router.get("/", taskController.getTasks);              // READ (todas)
router.put("/:id", taskController.updateTask);         // UPDATE
router.delete("/:id", taskController.deleteTask);      // DELETE (mover a papelera)

// Rutas de papelera
router.get("/deleted", taskController.getDeletedTasks);        // READ (papelera)
router.post("/:id/restore", taskController.restoreTask);       // RESTORE
router.delete("/:id/permanent", taskController.permanentlyDeleteTask); // DELETE permanente

module.exports = router;
