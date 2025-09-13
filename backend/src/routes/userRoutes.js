const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
const { loginLimiter } = require("../middleware/auth");
const { authenticateToken } = require("../middleware/auth");



// Crear un nuevo usuario
router.post("/register", authController.register);

// Iniciar sesión
router.post("/login", loginLimiter ,authController.login);

// Cerrar sesión
router.post("/logout" ,authController.logout);

// Olvidé mi contraseña
router.post("/forgot-password", authController.forgotPassword);

// Reestablecer contraseña
router.post("/reset-password" ,authController.resetPassword);

// Crear tarea
router.post("/tasks", authenticateToken, taskController.createTask);

module.exports = router;