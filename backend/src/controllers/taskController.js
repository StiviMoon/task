const TaskDAO = require("../dao/TaskDAO");
const config = require("../config/environment");


/**
 * Controller to handle task-related operations.
 */


/**
 * Creates a new task.
 * The task is associated with the authenticated user via the `userId` extracted from the JWT.
 *
 * @async
 * @function createTask
 * @param {Request} req Express request object containing `title`, `details`, `date`, `hour`, and `status`.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * 
 * - 201: `{ success: true, taskId, task }`  
 *   If the task is created successfully.
 * - 400: `{ success: false, message: error.message }`  
 *   If validation fails.
 * - 500: `{ success: false, message: error.message }`  
 *   If a server error occurs. The error is logged in development mode.
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
 * Retrieves all tasks for the authenticated user.
 *
 * @async
 * @function getTasks
 * @param {Request} req Express request object containing the authenticated user.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * 
 * - 200: `{ tasks }`  
 *   If the operation is successful.
 * - 400: `{ success: false, message: error.message }`  
 *   If an error occurs.
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
 * Updates an existing task.
 *
 * @async
 * @function updateTask
 * @param {Request} req Express request object containing the task ID in `params` and task data in the body.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * 
 * - 200: `{ success: true, task }`  
 *   If the task was updated successfully.
 * - 404: `{ success: false, message: "Tarea no encontrada." }`  
 *   If the task does not exist or does not belong to the user.
 * - 400: `{ success: false, message: error.message }`  
 *   If validation fails.
 * - 500: `{ success: false, message: error.message }`  
 *   If a server error occurs. The error is logged in development mode.
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
 * Deletes an existing task.
 *
 * @async
 * @function deleteTask
 * @param {Request} req Express request object containing the task ID in `params`.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * 
 * - 200: `{ success: true, message: "Tarea eliminada exitosamente." }`  
 *   If the task was deleted successfully.
 * - 404: `{ success: false, message: "Tarea no encontrada." }`  
 *   If the task does not exist or does not belong to the user.
 * - 500: `{ success: false, message: error.message }`  
 *   If a server error occurs. The error is logged in development mode.
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
