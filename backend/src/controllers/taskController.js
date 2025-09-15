const TaskDAO = require("../dao/TaskDAO");
const config = require("../config/environment");


/**
 * Controller for handling task-related operations.
 */

/**
 * Create a new task.
 * The task is associated with the authenticated user via the userId extracted from the JWT token.
 *
 * @async
 * @function createTask
 * @param {import("express").Request} req - Express request object containing task details in the body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 201: `{ success: true, taskId, task }` if the task is created successfully.
 * - 400: `{ success: false, message }` if a validation error occurs.
 * - 500: `{ success: false, message }` if a server error occurs (logs error in development mode).
 */
exports.createTask = async (req, res) => {
    try {
        const { title, details, date, hour, status } = req.body;
        const userId = req.user.userId;

        const newTask = await TaskDAO.createTask({ title, details, date, hour, status }, userId);
        res.status(201).json({ success: true, taskId: newTask._id, task: newTask });
    } catch (error) {
        if(config.NODE_ENV === "development") {
            console.error(error);
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Get all tasks for the authenticated user.
 *
 * @async
 * @function getTasks
 * @param {import("express").Request} req - Express request object with authenticated user.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200: `{ tasks }` if tasks are retrieved successfully.
 * - 400: `{ success: false, message }` if an error occurs.
 */
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tasks = await TaskDAO.getUserTasks(userId);
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Update an existing task.
 *
 * @async
 * @function updateTask
 * @param {import("express").Request} req - Express request object containing task ID in params and update data in body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200: `{ success: true, task }` if the task is updated successfully.
 * - 404: `{ success: false, message: "Task not found." }` if the task does not exist or does not belong to the user.
 * - 400: `{ success: false, message }` if a validation error occurs.
 * - 500: `{ success: false, message }` if a server error occurs (logs error in development mode).
 */
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, date, hour, status } = req.body;
        const userId = req.user.userId;

        const updatedTask = await TaskDAO.updateUserTask(id, userId, { title, details, date, hour, status });

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Tarea no encontrada." });
        }

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        if (config.NODE_ENV === "development") {
            console.error(error);
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Delete an existing task.
 *
 * @async
 * @function deleteTask
 * @param {import("express").Request} req - Express request object containing task ID in params.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200: `{ success: true, message: "Task deleted successfully." }` if the task is deleted.
 * - 404: `{ success: false, message: "Task not found." }` if the task does not exist or does not belong to the user.
 * - 500: `{ success: false, message }` if a server error occurs (logs error in development mode).
 */
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const deletedTask = await TaskDAO.deleteUserTask(id, userId);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Tarea no encontrada." });
        }

        res.status(200).json({ success: true, message: "Tarea eliminada exitosamente." });
    } catch (error) {
        if (config.NODE_ENV === "development") {
            console.error(error);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
