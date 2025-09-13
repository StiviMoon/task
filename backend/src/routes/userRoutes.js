const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const { loginLimiter } = require("../middleware/auth");








// Iniciar sesión
router.post("/login", loginLimiter ,authController.login);

// Cerrar sesión
router.post("/logout" ,authController.logout);


// Olvidé mi contraseña
router.post("/forgot-password", authController.forgotPassword);

// Reestablecer contraseña
router.post("/reset-password" ,authController.resetPassword);

module.exports = router;