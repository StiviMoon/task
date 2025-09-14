const express = require('express');
const router = express.Router();

// Import main routes
const routes = require('./routes');

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Welcome route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '¡Bienvenido a la API!',
        version: process.env.API_VERSION || 'v1',
        status: 'Servidor listo para desarrollo'
    });
});

// Use main routes
router.use('/', routes);

module.exports = router;
