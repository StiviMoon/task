const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
    // Server configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager',

    // Frontend configuration
    FRONTEND_URL: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://task-three-blue.vercel.app' : 'http://localhost:3000'),

    // API configuration
    API_VERSION: process.env.API_VERSION || 'v1',
    API_PREFIX: process.env.API_PREFIX || '/api',

    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET || 'your_jwt_reset_secret',


    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    // Email configuration (Resend)
    RESEND_API_KEY: process.env.RESEND_API_KEY || ''
};

module.exports = config;
