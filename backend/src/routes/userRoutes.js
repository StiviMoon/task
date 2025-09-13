const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/auth");




// Iniciar sesión
router.post("/login", loginLimiter ,authController.login);

// Cerrar sesión
router.post("/logout" ,authController.logout);


// Crear un nuevo usuario
router.post("/register", authController.register);



module.exports = router;