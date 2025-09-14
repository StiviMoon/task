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

// Limitador de tasa para la ruta de inicio de sesión
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
