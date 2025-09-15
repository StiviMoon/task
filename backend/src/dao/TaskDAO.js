const BaseDAO = require('./BaseDAO');
const Task = require('../models/Task');

/**
 * Data Access Object (DAO) for task operations.
 * Extends {@link BaseDAO} to provide task-specific database methods.
 * 
 * @class TaskDAO
 * @extends BaseDAO
 */
class TaskDAO extends BaseDAO {
    /**
     * Creates an instance of TaskDAO.
     * Uses the {@link Task} model as the base.
     */
    constructor() {
        super(Task);
    }

    /**
     * Create a new task associated with a user.
     * 
     * @async
     * @param {Object} taskData - Task data (e.g., title, description, status).
     * @param {string} userId - ID of the task owner.
     * @returns {Promise<Object>} - The created task object.
     * @throws {Error} - If an error occurs during task creation.
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
     * Get all tasks belonging to a user.
     * 
     * @async
     * @param {string} userId - ID of the user.
     * @returns {Promise<Array<Object>>} - List of tasks ordered by creation date.
     * @throws {Error} - If an error occurs during retrieval.
     */
    async getUserTasks(userId) {
        try {
            return await this.find({ userId }, { sort: { createdAt: -1 } });
        } catch (error) {
            throw new Error(`Error al obtener tareas del usuario: ${error.message}`);
        }
    }

    /**
     * Find a specific task of a user.
     * 
     * @async
     * @param {string} taskId - ID of the task.
     * @param {string} userId - ID of the task owner.
     * @returns {Promise<Object|null>} - The task if found, otherwise `null`.
     * @throws {Error} - If an error occurs during the search.
     */
    async getUserTask(taskId, userId) {
        try {
            return await this.findOne({ _id: taskId, userId });
        } catch (error) {
            throw new Error(`Error al buscar tarea: ${error.message}`);
        }
    }

    /**
     * Update a user's task.
     * 
     * @async
     * @param {string} taskId - ID of the task.
     * @param {string} userId - ID of the task owner.
     * @param {Object} updateData - Data to update in the task.
     * @returns {Promise<Object|null>} - The updated task, or `null` if not found.
     * @throws {Error} - If an error occurs during the update.
     */
    async updateUserTask(taskId, userId, updateData) {
        try {
            // Verify that the task belongs to the user
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
     * Delete a user's task.
     * 
     * @async
     * @param {string} taskId - ID of the task.
     * @param {string} userId - ID of the task owner.
     * @returns {Promise<Object|null>} - The deleted task, or `null` if not found.
     * @throws {Error} - If an error occurs during deletion.
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
