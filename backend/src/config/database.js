const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB conectado: ${conn.connection.host}`);
        console.log(`Base de datos: ${conn.connection.name}`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        console.log('Asegúrate de configurar MONGODB_URI en tu archivo .env');

        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
