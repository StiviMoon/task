const express = require('express');
const connectDB = require('./src/config/database');
const configureServer = require('./src/config/server');
const config = require('./src/config/environment');
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');
const cookieParser = require('cookie-parser');


// Import routes
const indexRoutes = require('./src/routes/index');

// Initialize Express app
const app = express();

// Configure server middleware
configureServer(app);

// Parse cookies before routes (needed for auth middleware)
app.use(cookieParser());

// Connect to MongoDB
if (config.MONGODB_URI && config.MONGODB_URI !== 'mongodb://localhost:27017/task-manager') {
    connectDB().catch(err => {
        console.error('❌ Error conectando a MongoDB:', err.message);
        if (config.NODE_ENV === 'production') {
            console.log('🔄 Reintentando conexión en 5 segundos...');
            setTimeout(() => {
                connectDB().catch(console.error);
            }, 5000);
        }
    });
} else {
    console.log('⚠️  MongoDB no configurado, continuando sin base de datos...');
}

// Root route for Render health checks
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Manager API - Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        apiBase: `${req.protocol}://${req.get('host')}${config.API_PREFIX}`,
        version: config.API_VERSION || 'v1'
    });
});

// API Routes
app.use(`${config.API_PREFIX}`, indexRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 API disponible en: http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${config.NODE_ENV}`);
    console.log(`📚 API Base: http://localhost:${PORT}${config.API_PREFIX}`);
    console.log(`🔧 API_PREFIX configurado como: "${config.API_PREFIX}"`);
    console.log(`🔧 NODE_ENV: ${config.NODE_ENV}`);
});
