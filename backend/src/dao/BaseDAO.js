/**
 * BaseDAO - Clase base para operaciones CRUD comunes
 * Proporciona métodos genéricos que heredan todos los DAOs específicos
 */
class BaseDAO {
    constructor(model) {
        this.model = model;
    }

    /**
     * Crear un nuevo documento
     * @param {Object} data - Datos para crear el documento
     * @returns {Promise<Object>} - Documento creado
     */
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar un documento por ID
     * @param {String} id - ID del documento
     * @returns {Promise<Object|null>} - Documento encontrado o null
     */
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar un documento por criterio
     * @param {Object} criteria - Criterios de búsqueda
     * @returns {Promise<Object|null>} - Documento encontrado o null
     */
    async findOne(criteria) {
        try {
            return await this.model.findOne(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar múltiples documentos
     * @param {Object} criteria - Criterios de búsqueda
     * @param {Object} options - Opciones (sort, limit, etc.)
     * @returns {Promise<Array>} - Array de documentos
     */
    async find(criteria = {}, options = {}) {
        try {
            let query = this.model.find(criteria);

            if (options.sort) query = query.sort(options.sort);
            if (options.limit) query = query.limit(options.limit);
            if (options.skip) query = query.skip(options.skip);
            if (options.populate) query = query.populate(options.populate);

            return await query;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar un documento por ID
     * @param {String} id - ID del documento
     * @param {Object} data - Datos a actualizar
     * @param {Object} options - Opciones de actualización
     * @returns {Promise<Object|null>} - Documento actualizado
     */
    async updateById(id, data, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findByIdAndUpdate(id, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar un documento por criterio
     * @param {Object} criteria - Criterios de búsqueda
     * @param {Object} data - Datos a actualizar
     * @param {Object} options - Opciones de actualización
     * @returns {Promise<Object|null>} - Documento actualizado
     */
    async updateOne(criteria, data, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findOneAndUpdate(criteria, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar un documento por ID
     * @param {String} id - ID del documento
     * @returns {Promise<Object|null>} - Documento eliminado
     */
    async deleteById(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar un documento por criterio
     * @param {Object} criteria - Criterios de búsqueda
     * @returns {Promise<Object|null>} - Documento eliminado
     */
    async deleteOne(criteria) {
        try {
            return await this.model.findOneAndDelete(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Contar documentos
     * @param {Object} criteria - Criterios de búsqueda
     * @returns {Promise<Number>} - Número de documentos
     */
    async count(criteria = {}) {
        try {
            return await this.model.countDocuments(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar si existe un documento
     * @param {Object} criteria - Criterios de búsqueda
     * @returns {Promise<Boolean>} - true si existe, false si no
     */
    async exists(criteria) {
        try {
            const count = await this.model.countDocuments(criteria);
            return count > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseDAO;
