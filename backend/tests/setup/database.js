// database.js
// Setup de base de datos para tests de integración

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const setupTestDatabase = async () => {
  try {
    // Cerrar cualquier conexión existente
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Test database connected');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

const cleanupTestDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error cleaning test database:', error);
  }
};

const closeTestDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
};

module.exports = {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase
};
