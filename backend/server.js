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

// Connect to MongoDB (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Routes
app.use(`${config.API_PREFIX}`, indexRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  const PORT = config.PORT;
  app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📱 API disponible en: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${config.NODE_ENV}`);
      console.log(`📚 API Base: http://localhost:${PORT}${config.API_PREFIX}`);
  });
}

// Export app for testing
module.exports = app;
