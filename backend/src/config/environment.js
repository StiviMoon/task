const dotenv = require('dotenv');

// Load environment variables from .env file into process.env
dotenv.config();

/**
 * Application configuration object.
 *
 * This object centralizes all configuration values used in the application.
 * It loads environment variables from the `.env` file if available, and
 * provides default values when variables are not set.
 *
 * @typedef {Object} Config
 * @property {number|string} PORT - Port number where the server will run (default: 5000).
 * @property {string} NODE_ENV - Current environment (e.g., 'development', 'production').
 * @property {string} MONGODB_URI - MongoDB connection string (default: local MongoDB instance).
 * @property {string} FRONTEND_URL - URL for the frontend application (changes depending on environment).
 * @property {string} API_VERSION - API version used for versioning endpoints (default: 'v1').
 * @property {string} API_PREFIX - API route prefix (default: '/api').
 * @property {string} JWT_SECRET - Secret key for signing JWT tokens.
 * @property {string} JWT_RESET_PASSWORD_SECRET - Secret key for signing password reset tokens.
 * @property {string} RESEND_API_KEY - API key for Resend email service.
 */

/**
 * Global configuration settings.
 * @type {Config}
 */
const config = {
    // Server configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager',

    // Frontend configuration
    FRONTEND_URL: process.env.FRONTEND_URL || 
        (process.env.NODE_ENV === 'production' 
            ? 'https://task-three-blue.vercel.app' 
            : 'http://localhost:3000'),

    // API configuration
    API_VERSION: process.env.API_VERSION || 'v1',
    API_PREFIX: process.env.API_PREFIX || '/api',

    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET || 'your_jwt_reset_secret',

    // Email configuration (Resend)
    RESEND_API_KEY: process.env.RESEND_API_KEY || ''
};

module.exports = config;
