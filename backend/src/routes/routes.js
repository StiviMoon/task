const express = require("express");
const userRoutes = require("./userRoutes");


const router = express.Router();


router.use("/auth", userRoutes);

// Implementar luego las rutas protegidas aquí. ( por el Auth.js )

module.exports = router;
