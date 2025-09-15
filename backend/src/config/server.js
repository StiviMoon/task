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
        origin: true, // Permite TODOS los orígenes
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'User-Agent', 'X-Requested-With', 'Access-Control-Allow-Origin'],
        exposedHeaders: ['Set-Cookie'],
        optionsSuccessStatus: 200, // Para compatibilidad con navegadores antiguos
        preflightContinue: false
    }));


    // Headers adicionales para máxima compatibilidad
    app.use((req, res, next) => {
        // Permitir acceso desde cualquier origen
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

        // Para solicitudes OPTIONS (preflight)
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
