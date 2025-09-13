const task = require("../models/Task");
const config = require("../config/environment");


/**
 * Controlador para manejar las operaciones relacionadas con las tareas.
 */

// Crear una nueva tarea
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
