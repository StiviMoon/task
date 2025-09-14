const mongoose = require('mongoose');
const config = require('./environment');

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * This function attempts to connect to the database defined in the
 * `MONGODB_URI` environment variable (loaded from the configuration file).
 * If the connection is successful, it logs the connection host and the
 * database name to the console. If the connection fails, it logs an
 * error message and exits the process in production mode.
 *
 * @async
 * @function connectDB
 * @throws Will log and exit the process if the connection fails in production.
 * @example
 * // Example usage in your server setup:
 * const connectDB = require('./config/database');
 * connectDB();
 */

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI);

        console.log(`MongoDB conectado: ${conn.connection.host}`);
        console.log(`Base de datos: ${conn.connection.name}`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        console.log('Asegúrate de configurar MONGODB_URI en tu archivo .env');

        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;