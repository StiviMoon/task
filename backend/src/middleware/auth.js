const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");


/**
 * Middleware para autenticar solicitudes usando JWT.
 * @param {Request} req  objeto de solicitud HTTP.
 * @param {Response} res objeto de respuesta HTTP.
 * @param {Next} next   función para pasar al siguiente middleware.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    req.cookies?.access_token ||
    (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token de acceso requerido"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token inválido o expirado"
      });
    }
    req.user = user;
    next();
  });
};

// Limitador de tasa compatible con IPv6 para producción
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: process.env.NODE_ENV === 'production' ? 50 : 100, // Más restrictivo en producción
  message: {
    success: false,
    message: "Demasiados intentos. Espera 5 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Usar el generador por defecto que maneja IPv6 correctamente
  skip: (req) => {
    // Skip rate limiting en desarrollo con variable de entorno
    return process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true';
  }
});

module.exports = { authenticateToken, loginLimiter };
