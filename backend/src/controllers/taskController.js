const task = require("../models/Task");
const config = require("../config/environment");


/**
 * Controlador para manejar las operaciones relacionadas con las tareas.
 */



/**
 *
 * Crear una nueva tarea.
 * La tarea se asocia al usuario autenticado mediante el userId extraído del token JWT.
 *
 * @param {*} req
 * @param {*} res
 * @return {void}
 * Si la creación es exitosa, responde con el ID de la nueva tarea y un estado 201.
 * Si hay un error de validación, responde con un estado 400 y el mensaje de error.
 * Si hay un error del servidor, responde con un estado 500 y si esta en modo desarrollo se imprime el error.
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
 * Actualiza una tarea existente.
 * @param {*} req
 * @param {*} res
 * @return {void}
 * Si la actualización es exitosa, responde con la tarea actualizada y un estado 200.
 * Si la tarea no existe o no pertenece al usuario, responde con un estado 404.
 * Si hay un error de validación, responde con un estado 400 y el mensaje de error.
 * Si hay un error del servidor, responde con un estado 500.
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
 * Elimina una tarea existente.
 * @param {*} req
 * @param {*} res
 * @return {void}
 * Si la eliminación es exitosa, responde con un mensaje de confirmación y un estado 200.
 * Si la tarea no existe o no pertenece al usuario, responde con un estado 404.
 * Si hay un error del servidor, responde con un estado 500.
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
