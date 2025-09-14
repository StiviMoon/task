const express = require('express');
const cors = require('cors');


// Import custom middleware
const logger = require('../middleware/logger');

const configureServer = (app) => {
    // CORS configuration
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values

    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('CORS blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
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
