const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");


/**
 * Middleware to authenticate requests using JWT.
 *
 * Extracts the token from cookies or the Authorization header,
 * verifies it, and attaches the decoded user object to `req.user`.
 *
 * @function authenticateToken
 * @param {import("express").Request} req - HTTP request object.
 * @param {import("express").Response} res - HTTP response object.
 * @param {import("express").NextFunction} next - Function to pass control to the next middleware.
 * @returns {void}
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

/**
 * Rate limiter for login requests.
 *
 * Restricts the number of login attempts within a given time window.
 * IPv6-compatible and stricter in production mode.
 *
 * @constant
 */
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100, //More restrictive in production
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
