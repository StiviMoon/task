/**
 * Middleware de manejo de errores global para Express.
 * Envía un mensaje genérico para errores 5XX y muestra detalles solo en desarrollo.
 *
 * @param {Error} err - Objeto de error lanzado.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {Function} next - Función next de Express.
 * @returns {void}
 */

const config = require('../config/environment');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (config.NODE_ENV === 'development') {
        console.error('❌ Error Details:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
        });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Recurso no encontrado - ID inválido';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `El ${field} ya existe en la base de datos`;
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token inválido';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expirado';
        error = { message, statusCode: 401 };
    }

    // Syntax errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const message = 'JSON inválido en el cuerpo de la petición';
        error = { message, statusCode: 400 };
    }

    // Rate limiting errors
    if (err.status === 429) {
        const message = 'Demasiadas peticiones, intenta más tarde';
        error = { message, statusCode: 429 };
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        error: statusCode >= 500 ? 'Intenta de nuevo más tarde' : message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: {
                name: err.name,
                code: err.code,
                url: req.originalUrl,
                method: req.method
            }
        })
    });
};

module.exports = errorHandler;