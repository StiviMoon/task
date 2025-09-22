const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Basic CRUD of tasks
router.post("/", taskController.createTask);           // CREATE
router.get("/", taskController.getTasks);              // READ (all)
router.put("/:id", taskController.updateTask);         // UPDATE
router.delete("/:id", taskController.deleteTask);      // DELETE (move to trash)

// Trash routes
router.get("/deleted", taskController.getDeletedTasks);        // READ (bin)
router.post("/:id/restore", taskController.restoreTask);       // RESTORE
router.delete("/:id/permanent", taskController.permanentlyDeleteTask); // DELETE permanent

module.exports = router;
