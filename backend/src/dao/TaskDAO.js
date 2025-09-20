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
     * Obtener todas las tareas de un usuario (no eliminadas)
     * @param {String} userId - ID del usuario
     * @returns {Promise<Array>} - Array de tareas
     */
    async getUserTasks(userId) {
        try {
            return await this.find({ userId, isDeleted: false }, { sort: { createdAt: -1 } });
        } catch (error) {
            throw new Error(`Error al obtener tareas del usuario: ${error.message}`);
        }
    }

    /**
     * Obtener tareas eliminadas de un usuario (papelera)
     * @param {String} userId - ID del usuario
     * @returns {Promise<Array>} - Array de tareas eliminadas
     */
    async getDeletedTasks(userId) {
        try {
            return await this.find({ userId, isDeleted: true }, { sort: { updatedAt: -1 } });
        } catch (error) {
            throw new Error(`Error al obtener tareas eliminadas: ${error.message}`);
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
     * Eliminar una tarea del usuario (eliminación lógica)
     * @param {String} taskId - ID de la tarea
     * @param {String} userId - ID del usuario
     * @returns {Promise<Object|null>} - Tarea marcada como eliminada o null
     */
    async deleteUserTask(taskId, userId) {
        try {
            // Verificar que la tarea pertenece al usuario
            const task = await this.findOne({ _id: taskId, userId });
            if (!task) {
                return null;
            }

            // Marcar como eliminada en lugar de eliminar físicamente
            return await this.updateById(taskId, { isDeleted: true });
        } catch (error) {
            throw new Error(`Error al eliminar tarea: ${error.message}`);
        }
    }

    /**
     * Restaurar una tarea de la papelera
     * @param {String} taskId - ID de la tarea
     * @param {String} userId - ID del usuario
     * @returns {Promise<Object|null>} - Tarea restaurada o null
     */
    async restoreUserTask(taskId, userId) {
        try {
            // Verificar que la tarea eliminada pertenece al usuario
            const task = await this.findOne({ _id: taskId, userId, isDeleted: true });
            if (!task) {
                return null;
            }

            // Restaurar la tarea
            return await this.updateById(taskId, { isDeleted: false });
        } catch (error) {
            throw new Error(`Error al restaurar tarea: ${error.message}`);
        }
    }

    /**
     * Eliminar permanentemente una tarea de la papelera
     * @param {String} taskId - ID de la tarea
     * @param {String} userId - ID del usuario
     * @returns {Promise<Object|null>} - Tarea eliminada permanentemente o null
     */
    async permanentlyDeleteUserTask(taskId, userId) {
        try {
            // Verificar que la tarea eliminada pertenece al usuario
            const task = await this.findOne({ _id: taskId, userId, isDeleted: true });
            if (!task) {
                return null;
            }

            // Eliminar permanentemente
            return await this.deleteById(taskId);
        } catch (error) {
            throw new Error(`Error al eliminar permanentemente: ${error.message}`);
        }
    }

}

module.exports = new TaskDAO();
