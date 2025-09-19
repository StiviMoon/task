const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");


/**
 * Middleware for authenticating requests using JWT.
 *
 * - Extracts the token from cookies (`access_token`) or `Authorization` header.
 * - Verifies the token using the secret key.
 * - If valid, attaches the decoded user info to `req.user`.
 * - If invalid or missing, returns an error in Spanish.
 * @function authenticateToken
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware callback.
 * @returns {void} Sends a JSON error response if authentication fails.
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
  max: process.env.NODE_ENV === 'production' ? 50 : 100, // More restrictive in production
  message: {
    success: false,
    message: "Demasiados intentos. Espera 5 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use the default generator that handles IPv6 correctly
  skip: (req) => {
    // Skip rate limiting in development with environment variable
    return process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true';
  }
});

module.exports = { authenticateToken, loginLimiter };
