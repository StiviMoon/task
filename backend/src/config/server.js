const express = require('express');
const cors = require('cors');


// Import custom middleware
const logger = require('../middleware/logger');

const configureServer = (app) => {
    // CORS configuration
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
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
