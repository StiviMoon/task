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

// Debug route to list all available routes
router.get('/debug/routes', (req, res) => {
    const routes = [];

    // Get all routes from the main router
    const mainRouter = require('./routes');

    // This is a simplified version - in a real app you'd traverse the router stack
    const availableRoutes = [
        'GET /health',
        'GET /',
        'POST /users/register',
        'POST /users/login',
        'POST /users/logout',
        'GET /users/verify',
        'POST /users/forgot-password',
        'POST /users/reset-password',
        'GET /users/profile',
        'PUT /users/profile',
        'POST /tasks',
        'GET /tasks',
        'PUT /tasks/:id',
        'DELETE /tasks/:id',
        'GET /tasks/deleted',
        'POST /tasks/:id/restore',
        'DELETE /tasks/:id/permanent'
    ];

    res.status(200).json({
        success: true,
        message: 'Rutas disponibles',
        apiPrefix: process.env.API_PREFIX || '/api',
        routes: availableRoutes.map(route => `${process.env.API_PREFIX || '/api'}${route}`)
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
