// jest.setup.js
// Configuración global para Jest

// Configurar timeout para tests
jest.setTimeout(30000);

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_RESET_PASSWORD_SECRET = 'test_jwt_reset_secret';

// Suprimir logs durante los tests
global.console = {
  ...console,
  // Mantener solo los logs de error
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // error: console.error, // Mantener errores
};
