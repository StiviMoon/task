const express = require('express');
const cors = require('cors');

// Import custom middleware
const logger = require('../controller/taskController');

/**
 * Configures the Express application with middleware such as
 * CORS, logging, body parsers, and static file serving.
 *
 * @function configureServer
 * @param {import('express').Application} app - The Express application instance.
 *
 * @description
 * This function sets up:
 * - **CORS configuration** with allowed origins from environment variables and defaults.
 * - **Custom logger middleware** for request logging.
 * - **Body parsers** for JSON and URL-encoded data.
 * - **Static file serving** from the `public/` directory.
 *
 * @example
 * const express = require('express');
 * const configureServer = require('./config/configureServer');
 *
 * const app = express();
 * configureServer(app);
 */
const configureServer = (app) => {
    // Default allowed origins for CORS
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', // Alternative frontend port
        'http://localhost:5173',
        'https://task-three-blue.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values

    // Add additional origins from environment variable (comma-separated)
    if (process.env.ADDITIONAL_ORIGINS) {
        const additionalOrigins = process.env.ADDITIONAL_ORIGINS
            .split(',')
            .map(origin => origin.trim());
        allowedOrigins.push(...additionalOrigins);
    }

    // Configure CORS middleware
    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests without origin (e.g., mobile apps, curl)
            if (!origin) return callback(null, true);

            console.log('CORS checking origin:', origin);
            console.log('Allowed origins:', allowedOrigins);

            if (allowedOrigins.includes(origin)) {
                console.log('CORS allowed origin:', origin);
                callback(null, true);
            } else {
                console.log('CORS blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie'],
        optionsSuccessStatus: 200 // For compatibility with older browsers
    }));

    // Logging middleware
    app.use(logger);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files (optional)
    app.use(express.static('public'));
};

module.exports = configureServer;
