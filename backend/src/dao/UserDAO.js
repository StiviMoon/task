const BaseDAO = require('./BaseDAO');
const User = require('../models/User');

/**
 * UserDAO - Data Access Object for user-related operations.
 * 
 * Extends `BaseDAO` to provide custom methods specific to the User model.
 * Handles creation, updates, and queries with additional validations.
 *
 * @class
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
     * @param {string} email - User's email address.
     * @returns {Promise<Object|null>} - Found user object or null if not found.
     * @throws {Error} - If a database error occurs.
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
     *
     * - Validates if the email already exists.
     *
     * @async
     * @param {Object} userData - Data for the new user.
     * @returns {Promise<Object>} - Created user object.
     * @throws {Error} - If email already exists or a database error occurs.
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
     * @returns {Promise<boolean>} - True if exists, false otherwise.
     * @throws {Error} - If a database error occurs.
     */
    async emailExists(email) {
        try {
            return await this.exists({ email: email.toLowerCase(), isDeleted: false });
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }

    /**
     * Update a user's password.
     *
     * @async
     * @param {string} userId - User ID.
     * @param {string} newPassword - New password.
     * @returns {Promise<Object|null>} - Updated user object or null if not found.
     * @throws {Error} - If update fails.
     */
    async updatePassword(userId, newPassword) {
        try {
            return await this.updateById(userId, { password: newPassword });
        } catch (error) {
            throw new Error(`Error al actualizar contraseña: ${error.message}`);
        }
    }

    /**
     * Update the reset password JTI (JWT ID).
     *
     * @async
     * @param {string} userId - User ID.
     * @param {string|null} jti - JTI value, or null to invalidate.
     * @returns {Promise<Object|null>} - Updated user object or null if not found.
     * @throws {Error} - If update fails.
     */
    async updateResetPasswordJti(userId, jti) {
        try {
            return await this.updateById(userId, { resetPasswordJti: jti });
        } catch (error) {
            throw new Error(`Error al actualizar JTI de reset: ${error.message}`);
        }
    }

    /**
     * Get a user's basic profile without sensitive data.
     *
     * @async
     * @param {string} userId - User ID.
     * @returns {Promise<Object|null>} - User profile or null if not found.
     * @throws {Error} - If retrieval fails.
     */ 
    async getUserProfile(userId) {
        try {
            const user = await this.findById(userId);
            if (!user || user.isDeleted) return null;
    
            // Return only non-sensitive data
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
     * Search for users using multiple criteria.
     *
     * Supports filtering by name, email, and age range.
     * Results can be paginated with `limit` and `skip`.
     *
     * @async
     * @param {Object} searchCriteria - Search filters.
     * @param {string} [searchCriteria.name] - Name (partial match, case-insensitive).
     * @param {string} [searchCriteria.email] - Email (partial match, case-insensitive).
     * @param {number} [searchCriteria.ageMin] - Minimum age.
     * @param {number} [searchCriteria.ageMax] - Maximum age.
     * @param {number} [searchCriteria.limit=50] - Max results.
     * @param {number} [searchCriteria.skip=0] - Results to skip.
     * @returns {Promise<Array>} - Array of users matching criteria.
     * @throws {Error} - If search fails.
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

    /** 
    * Boolean delete for the user
    * @async
    * @param {String}: userID
    */
    async softDeleteUser(userId) {
        try {
            const user = await this.findById(userId);
            if (!user || user.isDeleted) return null;
            return await this.updateById(userId, { isDeleted: true });
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

}

module.exports = new UserDAO();
