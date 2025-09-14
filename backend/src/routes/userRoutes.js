const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, authenticateToken } = require("../middleware/auth");

// Crear un nuevo usuario
router.post("/register", authController.register);

// Iniciar sesión
router.post("/login", loginLimiter, authController.login);

// Cerrar sesión
router.post("/logout", authController.logout);

// Verificar autenticación
router.get("/verify", authenticateToken, authController.verifyAuth);

// Olvidé mi contraseña
router.post("/forgot-password", authController.forgotPassword);

// Reestablecer contraseña
router.post("/reset-password", authController.resetPassword);

module.exports = router;
