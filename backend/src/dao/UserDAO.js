const BaseDAO = require('./BaseDAO');
const User = require('../models/User');

/**
 * Data Access Object (DAO) for user operations.
 * Extends {@link BaseDAO} with user-specific methods.
 * 
 * @class UserDAO
 * @extends BaseDAO
 */
class UserDAO extends BaseDAO {
     /**
     * Creates an instance of UserDAO using the {@link User} model.
     */
    constructor() {
        super(User);
    }

    /**
     * Find a user by email.
     * 
     * @async
     * @param {string} email - The user's email.
     * @returns {Promise<Object|null>} - The user object if found, otherwise `null`.
     * @throws {Error} - If an error occurs during the query.
     */
    async findByEmail(email) {
        try {
            return await this.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    /**
     * Create a new user.
     * Validates that the email does not already exist.
     * 
     * @async
     * @param {Object} userData - The new user data.
     * @returns {Promise<Object>} - The created user.
     * @throws {Error} - If the email already exists or creation fails.
     */
    async createUser(userData) {
        try {
            // Validate that the email does not exist
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Este correo ya está registrado');
            }

            return await this.create(userData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if an email already exists.
     * 
     * @async
     * @param {string} email - Email to check.
     * @returns {Promise<boolean>} - `true` if exists, otherwise `false`.
     * @throws {Error} - If the check fails.
     */
    async emailExists(email) {
        try {
            return await this.exists({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }

    /**
     * Update a user's password.
     * 
     * @async
     * @param {string} userId - ID of the user.
     * @param {string} newPassword - New password to set.
     * @returns {Promise<Object|null>} - The updated user or `null` if not found.
     * @throws {Error} - If the update fails.
     */
    async updatePassword(userId, newPassword) {
        try {
            return await this.updateById(userId, { password: newPassword });
        } catch (error) {
            throw new Error(`Error al actualizar contraseña: ${error.message}`);
        }
    }

    /**
     * Update the reset password JTI (token identifier).
     * Set `null` to invalidate the reset token.
     * 
     * @async
     * @param {string} userId - ID of the user.
     * @param {string|null} jti - Reset token JTI or `null`.
     * @returns {Promise<Object|null>} - The updated user or `null` if not found.
     * @throws {Error} - If the update fails.
     */
    async updateResetPasswordJti(userId, jti) {
        try {
            return await this.updateById(userId, { resetPasswordJti: jti });
        } catch (error) {
            throw new Error(`Error al actualizar JTI de reset: ${error.message}`);
        }
    }

    /**
     * Get a user's basic profile (without sensitive data).
     * 
     * @async
     * @param {string} userId - ID of the user.
     * @returns {Promise<Object|null>} - Basic user profile or `null` if not found.
     * @throws {Error} - If the query fails.
     */
    async getUserProfile(userId) {
        try {
            const user = await this.findById(userId);
            if (!user) return null;

            // Retornar solo datos no sensibles
            return {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                age: user.age,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw new Error(`Error al obtener perfil: ${error.message}`);
        }
    }

    /**
     * Search users by multiple criteria.
     * Supports filtering by name, email, age range, pagination, and sorting.
     * 
     * @async
     * @param {Object} searchCriteria - Search filters.
     * @param {string} [searchCriteria.name] - Filter by name (partial, case-insensitive).
     * @param {string} [searchCriteria.email] - Filter by email (partial, case-insensitive).
     * @param {number} [searchCriteria.ageMin] - Minimum age filter.
     * @param {number} [searchCriteria.ageMax] - Maximum age filter.
     * @param {number} [searchCriteria.limit=50] - Max number of results.
     * @param {number} [searchCriteria.skip=0] - Number of results to skip (for pagination).
     * @returns {Promise<Array<Object>>} - Array of users.
     * @throws {Error} - If the search fails.
     */
    async searchUsers(searchCriteria) {
        try {
            const { name, email, ageMin, ageMax, limit = 50, skip = 0 } = searchCriteria;

            let criteria = {};

            if (name) {
                criteria.name = { $regex: name, $options: 'i' };
            }

            if (email) {
                criteria.email = { $regex: email, $options: 'i' };
            }

            if (ageMin !== undefined || ageMax !== undefined) {
                criteria.age = {};
                if (ageMin !== undefined) criteria.age.$gte = ageMin;
                if (ageMax !== undefined) criteria.age.$lte = ageMax;
            }

            return await this.find(criteria, {
                limit,
                skip,
                sort: { createdAt: -1 }
            });
        } catch (error) {
            throw new Error(`Error en búsqueda de usuarios: ${error.message}`);
        }
    }
}

module.exports = new UserDAO();
