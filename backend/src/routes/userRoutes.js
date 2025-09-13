const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");




// Crear un nuevo usuario
router.post("/register", authController.register);


module.exports = router;