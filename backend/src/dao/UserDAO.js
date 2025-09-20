const BaseDAO = require('./BaseDAO');
const User = require('../models/User');

/**
 * UserDAO - Data Access Object para operaciones de Usuario
 * Extiende BaseDAO con métodos específicos para User
 */
class UserDAO extends BaseDAO {
    constructor() {
        super(User);
    }

    /**
     * Buscar usuario por email
     * @param {String} email - Email del usuario
     * @returns {Promise<Object|null>} - Usuario encontrado o null
     */
    async findByEmail(email) {
        try {
            return await this.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    /**
     * Crear nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} - Usuario creado
     */
    async createUser(userData) {
        try {
            // Validar que el email no exista
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
     * Verificar si un email existe
     * @param {String} email - Email a verificar
     * @returns {Promise<Boolean>} - true si existe, false si no
     */
    async emailExists(email) {
        try {
            return await this.exists({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }

    /**
     * Actualizar contraseña del usuario
     * @param {String} userId - ID del usuario
     * @param {String} newPassword - Nueva contraseña
     * @returns {Promise<Object|null>} - Usuario actualizado
     */
    async updatePassword(userId, newPassword) {
        try {
            return await this.updateById(userId, { password: newPassword });
        } catch (error) {
            throw new Error(`Error al actualizar contraseña: ${error.message}`);
        }
    }

    /**
     * Actualizar JTI de reset de contraseña
     * @param {String} userId - ID del usuario
     * @param {String|null} jti - JTI del token de reset (null para invalidar)
     * @returns {Promise<Object|null>} - Usuario actualizado
     */
    async updateResetPasswordJti(userId, jti) {
        try {
            return await this.updateById(userId, { resetPasswordJti: jti });
        } catch (error) {
            throw new Error(`Error al actualizar JTI de reset: ${error.message}`);
        }
    }

    /**
     * Obtener perfil básico del usuario (sin datos sensibles)
     * @param {String} userId - ID del usuario
     * @returns {Promise<Object|null>} - Perfil del usuario
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
     * Buscar usuarios por criterios múltiples
     * @param {Object} searchCriteria - Criterios de búsqueda
     * @returns {Promise<Array>} - Array de usuarios
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
