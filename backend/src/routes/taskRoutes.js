const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// CRUD básico de tareas
router.post("/", taskController.createTask);           // CREATE
router.get("/", taskController.getTasks);              // READ (todas)
router.put("/:id", taskController.updateTask);         // UPDATE
router.delete("/:id", taskController.deleteTask);      // DELETE

module.exports = router;
