const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Create a task
router.post("/", taskController.createTask);

// Get all tasks for the authenticated user
router.get("/", taskController.getTasks);

// Update a task
router.put("/:id", taskController.updateTask);

// Delete a task
router.delete("/:id", taskController.deleteTask);

module.exports = router;