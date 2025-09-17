const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Editar perfil
router.put("/me", authenticateToken, userController.editProfile);    

// Obtener información del perfil
router.get("/me", authenticateToken, userController.getProfile);

module.exports = router;
