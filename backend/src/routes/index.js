const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '¡Bienvenido a la API!',
        version: process.env.API_VERSION || 'v1',
        status: 'Servidor listo para desarrollo'
    });
});

module.exports = router;
