const express = require('express');
const cors = require('cors');


// Import custom middleware
const logger = require('../middleware/logger');

const configureServer = (app) => {
    // CORS configuration
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', // Puerto alternativo del frontend
        'http://localhost:5173',
        'https://task-three-blue.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values

    // Add additional origins from environment variable (comma-separated)
    if (process.env.ADDITIONAL_ORIGINS) {
        const additionalOrigins = process.env.ADDITIONAL_ORIGINS.split(',').map(origin => origin.trim());
        allowedOrigins.push(...additionalOrigins);
    }

    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            console.log('CORS checking origin:', origin);
            console.log('Allowed origins:', allowedOrigins);

            if (allowedOrigins.indexOf(origin) !== -1) {
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
        optionsSuccessStatus: 200 // Para compatibilidad con navegadores antiguos
    }));


    // Logging middleware
    app.use(logger);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files (opcional)
    app.use(express.static('public'));
};

module.exports = configureServer;
