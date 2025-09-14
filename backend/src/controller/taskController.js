const task = require("../models/Task");
const config = require("../config/environment");


/**
* Controller to handle task-related operations.
*/

/**
*
* Create a new task.
* The task is associated with the authenticated user using the userId extracted from the JWT token.
*
* @param {*} req
* @param {*} res
* @return {void}
* If the creation is successful, responds with the new task ID and a 201 status.
* If there is a validation error, responds with a 400 status and the error message.
* If there is a server error, responds with a 500 status, and if in development mode, the error is printed.
*
*/
exports.createTask = async (req, res) => {
    try {
        const { title, details, date, hour, status } = req.body;
        const userId = req.user.userId;
        const newTask = new task({ title, details, date , hour , status, userId });
        await newTask.save();
        res.status(201).json({ success: true, taskId: newTask._id, task: newTask });
    } catch (error) {
        if(config.NODE_ENV === "development") {
            console.error(error);
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * leer todas las tareas del usuario autenticado.
 * @param {*} req
 * @param {*} res
 * @return {void}
 * Si la operación es exitosa, responde con un estado 200 y un json con las tareas.
 */
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tasks = await task.find({ userId });
        res.status(200).json({ tasks });
    } catch (error) {
        if(error.status >= 500) {
            res.status(error.status).json({ success: false, message: error.message });
        }
        else{
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

/**
* Updates an existing task.
* @param {*} req
* @param {*} res
* @return {void}
* If the update is successful, responds with the updated task and a 200 status.
* If the task doesn't exist or doesn't belong to the user, responds with a 404 status.
* If there is a validation error, responds with a 400 status and the error message.
* If there is a server error, responds with a 500 status.
*/
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, date, hour, status } = req.body;
        const userId = req.user.userId;

        const taskToUpdate = await task.findOne({ _id: id, userId });
        if (!taskToUpdate) {
            return res.status(404).json({ success: false, message: "Tarea no encontrada." });
        }

        const updatedTask = await task.findByIdAndUpdate(
            id,
            { title, details, date, hour, status },
            { new: true, runValidators: true }
        );

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
* @param {*} req
* @param {*} res
* @return {void}
* If the deletion is successful, responds with a confirmation message and a 200 status.
* If the task doesn't exist or doesn't belong to the user, responds with a 404 status.
* If there is a server error, responds with a 500 status.
*/
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const taskToDelete = await task.findOne({ _id: id, userId });
        if (!taskToDelete) {
            return res.status(404).json({ success: false, message: "Tarea no encontrada." });
        }

        await task.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Tarea eliminada exitosamente." });
    } catch (error) {
        if (config.NODE_ENV === "development") {
            console.error(error);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
