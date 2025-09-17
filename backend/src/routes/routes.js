const express = require("express");
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");
const userRoutes = require("./userRoutes");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();


router.use("/auth", authRoutes);

// Implementar luego las rutas protegidas aquí. ( por el Auth.js )


router.use("/tasks", authenticateToken ,taskRoutes);

router.use("/users", authenticateToken, userRoutes );

module.exports = router;
