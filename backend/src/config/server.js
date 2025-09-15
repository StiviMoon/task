const express = require('express');
const cors = require('cors');


// Import custom middleware
const logger = require('../middleware/logger');

const configureServer = (app) => {
    // CORS configuration
    const allowedOrigins = [
        'http://localhost:3000',
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
            // Lista de orígenes permitidos
            const allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:5173', // Vite dev server
                'https://task-three-blue.vercel.app',
                process.env.FRONTEND_URL
            ].filter(Boolean);

            // Permitir peticiones sin origen (como Postman, curl, etc.)
            if (!origin) return callback(null, true);

            // Verificar si el origen está en la lista permitida
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                // En desarrollo, permitir todos los orígenes
                if (process.env.NODE_ENV === 'development') {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'User-Agent', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['Set-Cookie'],
        optionsSuccessStatus: 200,
        preflightContinue: false
    }));


    // Headers adicionales solo para OPTIONS que no manejó CORS
    app.use((req, res, next) => {
        // Solo manejar OPTIONS si no fue manejado por CORS
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    // Logging middleware
    app.use(logger);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files (opcional)
    app.use(express.static('public'));
};

module.exports = configureServer;
