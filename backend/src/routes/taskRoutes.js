const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");


// Crear tarea
router.post("/createTask", taskController.createTask);

module.exports = router;