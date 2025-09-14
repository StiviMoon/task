const express = require("express");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();


router.use("/auth", userRoutes);

// Implementar luego las rutas protegidas aquí. ( por el Auth.js )

router.use("/tasks", authenticateToken ,taskRoutes);


module.exports = router;

