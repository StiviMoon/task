const BaseDAO = require('./BaseDAO');
const Task = require('../models/Task');

/**
 * TaskDAO - Data Access Object for task-related operations.
 * 
 * Extends `BaseDAO` to provide custom methods specific to the Task model.
 * Handles CRUD operations for tasks associated with a specific user.
 *
 * @class
 * @extends BaseDAO
 */
class TaskDAO extends BaseDAO {
    constructor() {
        super(Task);
    }

    /**
     * Create a new task associated with a user.
     *
     * @async
     * @param {Object} taskData - Data for the new task.
     * @param {string} userId - Owner user's ID.
     * @returns {Promise<Object>} - Created task object.
     * @throws {Error} - If task creation fails.
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
     * Retrieve all tasks belonging to a user.
     *
     * @async
     * @param {string} userId - Owner user's ID.
     * @returns {Promise<Array>} - Array of tasks.
     * @throws {Error} - If retrieval fails.
     */
    async getUserTasks(userId) {
        try {
            return await this.find({ userId }, { sort: { createdAt: -1 } });
        } catch (error) {
            throw new Error(`Error al obtener tareas del usuario: ${error.message}`);
        }
    }

    /**
     * Retrieve a specific task by user.
     *
     * @async
     * @param {string} taskId - Task ID.
     * @param {string} userId - Owner user's ID.
     * @returns {Promise<Object|null>} - Task object if found, otherwise null.
     * @throws {Error} - If retrieval fails.
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
     * - Verifies that the task belongs to the user before updating.
     *
     * @async
     * @param {string} taskId - Task ID.
     * @param {string} userId - Owner user's ID.
     * @param {Object} updateData - Data to update.
     * @returns {Promise<Object|null>} - Updated task object or null if not found.
     * @throws {Error} - If update fails.
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
     * Delete a user's task.
     *
     * - Verifies that the task belongs to the user before deleting.
     *
     * @async
     * @param {string} taskId - Task ID.
     * @param {string} userId - Owner user's ID.
     * @returns {Promise<Object|null>} - Deleted task object or null if not found.
     * @throws {Error} - If deletion fails.
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
