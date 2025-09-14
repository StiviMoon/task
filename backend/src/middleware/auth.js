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

// Rate limter for login route.
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
    message: {
    success: false,
    message: "Cuenta temporalmente bloqueada."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authenticateToken, loginLimiter };
