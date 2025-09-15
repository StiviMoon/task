const mongoose = require('mongoose');
const config = require('./environment');

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs connection details if successful, or handles errors if the connection fails.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is established or the process exits on failure in production.
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