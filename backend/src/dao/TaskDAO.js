const BaseDAO = require('./BaseDAO');
const Task = require('../models/Task');

/**
 * TaskDAO - Data Access Object para operaciones de Tareas
 * Extiende BaseDAO con métodos específicos para Task
 */
class TaskDAO extends BaseDAO {
    constructor() {
        super(Task);
    }

    /**
     * Crear nueva tarea asociada a un usuario
     * @param {Object} taskData - Datos de la tarea
     * @param {String} userId - ID del usuario propietario
     * @returns {Promise<Object>} - Tarea creada
     */
    async createTask(taskData, userId) {
        try {
            const taskWithUser = { ...taskData, userId };
            return await this.create(taskWithUser);
        } catch (error) {
            throw new Error(`Error al crear tarea: ${error.message}`);
        }
    }

    /**
     * Obtener todas las tareas de un usuario
     * @param {String} userId - ID del usuario
     * @returns {Promise<Array>} - Array de tareas
     */
    async getUserTasks(userId) {
        try {
            return await this.find({ userId }, { sort: { createdAt: -1 } });
        } catch (error) {
            throw new Error(`Error al obtener tareas del usuario: ${error.message}`);
        }
    }

    /**
     * Buscar una tarea específica del usuario
     * @param {String} taskId - ID de la tarea
     * @param {String} userId - ID del usuario
     * @returns {Promise<Object|null>} - Tarea encontrada o null
     */
    async getUserTask(taskId, userId) {
        try {
            return await this.findOne({ _id: taskId, userId });
        } catch (error) {
            throw new Error(`Error al buscar tarea: ${error.message}`);
        }
    }

    /**
     * Actualizar una tarea del usuario
     * @param {String} taskId - ID de la tarea
     * @param {String} userId - ID del usuario
     * @param {Object} updateData - Datos a actualizar
     * @returns {Promise<Object|null>} - Tarea actualizada o null
     */
    async updateUserTask(taskId, userId, updateData) {
        try {
            // Verificar que la tarea pertenece al usuario
            const task = await this.getUserTask(taskId, userId);
            if (!task) {
                return null;
            }

            return await this.updateById(taskId, updateData);
        } catch (error) {
            throw new Error(`Error al actualizar tarea: ${error.message}`);
        }
    }

    /**
     * Eliminar una tarea del usuario
     * @param {String} taskId - ID de la tarea
     * @param {String} userId - ID del usuario
     * @returns {Promise<Object|null>} - Tarea eliminada o null
     */
    async deleteUserTask(taskId, userId) {
        try {
            // Verificar que la tarea pertenece al usuario antes de eliminar
            const task = await this.getUserTask(taskId, userId);
            if (!task) {
                return null;
            }

            return await this.deleteById(taskId);
        } catch (error) {
            throw new Error(`Error al eliminar tarea: ${error.message}`);
        }
    }

}

module.exports = new TaskDAO();
