/**
 * BaseDAO - Generic base class for common CRUD operations.
 * Provides reusable methods that all specific DAOs inherit from.
 */
class BaseDAO {
    constructor(model) {
         /**
         * The Mongoose model associated with the DAO.
         * @type {import("mongoose").Model}
         */
        this.model = model;
    }

    /**
     * Create a new document.
     * @param {Object} data - Data to create the document.
     * @returns {Promise<Object>} - The created document.
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
     * Find a document by ID.
     * @param {string} id - Document ID.
     * @returns {Promise<Object|null>} - Found document or null if not found.
     */
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find a single document by criteria.
     * @param {Object} criteria - Search criteria.
     * @returns {Promise<Object|null>} - Found document or null if not found.
     */
    async findOne(criteria) {
        try {
            return await this.model.findOne(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find multiple documents with optional filters.
     * @param {Object} [criteria={}] - Search criteria.
     * @param {Object} [options={}] - Options (sort, limit, skip, populate).
     * @returns {Promise<Array<Object>>} - Array of found documents.
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
     * Update a document by ID.
     * @param {string} id - Document ID.
     * @param {Object} data - Data to update.
     * @param {Object} [options={ new: true, runValidators: true }] - Update options.
     * @returns {Promise<Object|null>} - Updated document or null if not found.
     */
    async updateById(id, data, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findByIdAndUpdate(id, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update a document by criteria.
     * @param {Object} criteria - Search criteria.
     * @param {Object} data - Data to update.
     * @param {Object} [options={ new: true, runValidators: true }] - Update options.
     * @returns {Promise<Object|null>} - Updated document or null if not found.
     */
    async updateOne(criteria, data, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findOneAndUpdate(criteria, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a document by ID.
     * @param {string} id - Document ID.
     * @returns {Promise<Object|null>} - Deleted document or null if not found.
     */
    async deleteById(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a document by criteria.
     * @param {Object} criteria - Search criteria.
     * @returns {Promise<Object|null>} - Deleted document or null if not found.
     */
    async deleteOne(criteria) {
        try {
            return await this.model.findOneAndDelete(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Count documents by criteria.
     * @param {Object} [criteria={}] - Search criteria.
     * @returns {Promise<number>} - Number of documents found.
     */
    async count(criteria = {}) {
        try {
            return await this.model.countDocuments(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if a document exists by criteria.
     * @param {Object} criteria - Search criteria.
     * @returns {Promise<boolean>} - True if a document exists, false otherwise.
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
