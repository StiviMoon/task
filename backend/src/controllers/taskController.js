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
        res.status(201).json({ taskId: newTask._id });
    } catch (error) {
        if(error.status >= 500 && config.NODE_ENV == "development") {
            console.error(error);
        }
        else{
            res.status(400).json({ error: error.message });
        }
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
            res.status(error.status)
        }
        else{
            res.status(400);
        }
    }
}   