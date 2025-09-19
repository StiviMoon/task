const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");


/**
* Middleware for authenticating requests using JWT.
* @param {Request} req HTTP request object.
* @param {Response} res HTTP response object.
* @param {Next} next function to pass to the next middleware.
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

// Rate limiter for the login route
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
