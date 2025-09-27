/**
 * BaseDAO - Generic Data Access Object for common CRUD operations.
 * 
 * Provides reusable methods for interacting with MongoDB collections
 * using Mongoose. All specific DAOs should extend this class.
 *
 * @class
 */
class BaseDAO {
    /**
     * @constructor
     * @param {import("mongoose").Model} model - The Mongoose model to operate on.
     */
    constructor(model) {
         /**
         * The Mongoose model associated with the DAO.
         * @type {import("mongoose").Model}
         */
        this.model = model;
    }

    /**
     * Create a new document.
     * @async
     * @param {Object} data - Data to create the document.
     * @returns {Promise<Object>} - Created document.
     * @throws {Error} - If creation fails.
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
     * Find a document by its ID.
     * @async
     * @param {string} id - Document ID.
     * @returns {Promise<Object|null>} - Found document or null if not found.
     * @throws {Error} - If query fails.
     */
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find a document by given criteria.
     * @async
     * @param {Object} criteria - Search criteria.
     * @returns {Promise<Object|null>} - Found document or null if not found.
     * @throws {Error} - If query fails.
     */
    async findOne(criteria) {
        try {
            return await this.model.findOne(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find multiple documents with optional query options.
     * @async
     * @param {Object} [criteria={}] - Search criteria.
     * @param {Object} [options={}] - Query options (sort, limit, skip, populate).
     * @returns {Promise<Array>} - Array of documents.
     * @throws {Error} - If query fails.
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
     * Update a document by its ID.
     * @async
     * @param {string} id - Document ID.
     * @param {Object} data - Data to update.
     * @param {Object} [options={ new: true, runValidators: true }] - Update options.
     * @returns {Promise<Object|null>} - Updated document or null if not found.
     * @throws {Error} - If update fails.
     */
    async updateById(id, data, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findByIdAndUpdate(id, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update a document by given criteria.
     * @async
     * @param {Object} criteria - Search criteria.
     * @param {Object} data - Data to update.
     * @param {Object} [options={ new: true, runValidators: true }] - Update options.
     * @returns {Promise<Object|null>} - Updated document or null if not found.
     * @throws {Error} - If update fails.
     */
    async updateOne(criteria, data, options = { new: true, runValidators: true }) {
        try {
            return await this.model.findOneAndUpdate(criteria, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update multiple documents matching the given criteria.
     * @async
     * @param {Object} criteria - Search criteria.
     * @param {Object} data - Data to update.
     * @param {Object} [options={ runValidators: true }] - Update options.
     * @returns {Promise<Object>} - Mongoose update result.
     * @throws {Error} - If update fails.
     */
    async updateMany(criteria, data, options = { runValidators: true }) {
        try {
            return await this.model.updateMany(criteria, data, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a document by its ID.
     * @async
     * @param {string} id - Document ID.
     * @returns {Promise<Object|null>} - Deleted document or null if not found.
     * @throws {Error} - If deletion fails.
     */
    async deleteById(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a document by given criteria.
     * @async
     * @param {Object} criteria - Search criteria.
     * @returns {Promise<Object|null>} - Deleted document or null if not found.
     * @throws {Error} - If deletion fails.
     */
    async deleteOne(criteria) {
        try {
            return await this.model.findOneAndDelete(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Count documents matching the given criteria.
     * @async
     * @param {Object} [criteria={}] - Search criteria.
     * @returns {Promise<number>} - Number of matching documents.
     * @throws {Error} - If count fails.
     */
    async count(criteria = {}) {
        try {
            return await this.model.countDocuments(criteria);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if at least one document exists matching the criteria.
     * @async
     * @param {Object} criteria - Search criteria.
     * @returns {Promise<boolean>} - True if exists, false otherwise.
     * @throws {Error} - If query fails.
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
