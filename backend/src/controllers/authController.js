const UserDAO = require("../dao/UserDAO");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("../service/resendService");
const config = require("../config/environment");

/**
 * Registers a new user in the database.
 *
 * @async
 * @function register
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 201: `{ userId }` if registration is successful.
 * - 409: `{ message: "This email is already registered." }` if the email is duplicated.
 * - 400: `{ message: error.message }` if a validation or other error occurs.
 */
exports.register = async (req, res) => {
    try{
        const { name, lastName, age, email, password } = req.body;

        const user = await UserDAO.createUser({ name, lastName, age, email, password });
        res.status(201).json({ userId: user._id });
    }
    catch(error){
        if (error.message === "Este correo ya está registrado") {
            return res.status(409).json({
                message: "Este correo ya está registrado."
            });
        }
        res.status(400).json({ message: error.message });
    }
}



/**
 * Logs in a user by verifying their credentials.
 *
 * @async
 * @function login
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200: `{ success: true, message: "Login successful.", token }` if credentials are valid.
 * - 401: `{ success: false, message: "Invalid email or password." }` if authentication fails.
 * - 500: `{ success: false, message: "Try again later." }` if an internal error occurs.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserDAO.findByEmail(email);
    if(!user) return res.status(401).json({ success: false, message: 'Correo o contraseña inválidos' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({ success: false, message: 'Correo o contraseña inválidos' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Matches the cookie lifetime
    );

    // Adaptive cookie configuration according to environment
     const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("access_token", token, {
        httpOnly: false, // Accessible from JavaScript for maximum compatibility
        secure: isProduction, // HTTPS in production, HTTP in development
        sameSite: isProduction ? "none" : "lax", // "none" for cross-domain in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
        domain: undefined // No domain restriction
});

    res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso.",
        // Send token also in response for maximum compatibility
        token: token
    });
  }

  catch (err) {
    res.status(500).json({ success: false, message: "Inténtalo de nuevo más tarde." });
  }
};

/**
 * Logs out the user by clearing the authentication cookie.
 *
 * @function logout
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {void} Sends a JSON response:
 * - 200: `{ success: true, message: "Logged out successfully." }`
 * - 400: `{ success: false, message: error.message }` if an error occurs.
 */

exports.logout = (req, res) => {
    try{
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie("access_token", {
            httpOnly: false,
            secure: isProduction, // HTTPS en producción
            sameSite: isProduction ? "none" : "lax", // "none" para cross-domain en producción
            path: "/",
        });

        res.status(200).json({ success: true, message: "Sesión cerrada exitosamente." });
    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }

};

/**
 * Verifies if the user is authenticated.
 *
 * @function verifyAuth
 * @param {import("express").Request} req - Express request object (must include `req.user` from `authenticateToken` middleware).
 * @param {import("express").Response} res - Express response object.
 * @returns {void} Sends a JSON response:
 * - 200: `{ success: true, user: { id, email } }` if authenticated.
 * - 401: Unauthorized (handled by middleware).
 */
exports.verifyAuth = (req, res) => {
    try {
        // If we get here, the authenticateToken middleware has already verified that the token is valid
        res.status(200).json({
            success: true,
            user: {
                id: req.user.userId,
                email: req.user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Sends a password reset email with a JWT-based link.
 *
 * @async
 * @function forgotPassword
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200: `{ success: true }` if reset link is sent.
 * - 202: `{ success: false, message: "Email not registered." }` if no user is found.
 * - 500: `{ success: false, message: err.message }` if an internal error occurs.
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await UserDAO.findByEmail(email);
    if (!user) {
      return res.status(202).json({ success: false, message: "Correo no registrado." });
    }
    const jwtid = Math.random().toString(36).substring(2);
    const resetToken = jwt.sign(
      { userId: user._id },
      config.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: '1h' , jwtid }
    );

    await UserDAO.updateResetPasswordJti(user._id, jwtid);

    const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // In development, send to verified Resend email
    const emailToSend = process.env.NODE_ENV === 'production'
        ? 'johan.steven.rodriguez@correounivalle.edu.co'
        : email;

    await sendMail({
        to: emailToSend,
        subject: "Restablecimiento de contraseña",
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}\n\nSolicitado para: ${email}`,
        html: `
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p><strong>Solicitado para:</strong> ${email}</p>
        `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error en forgotPassword:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Resets the user's password using a valid JWT reset token.
 *
 * @async
 * @function resetPassword
 * @param {import("express").Request} req - Express request object containing `token` and `newPassword`.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200: `{ success: true, message: "Password updated." }` if successful.
 * - 400: `{ success: false, message: "Invalid or already used link." }` if token is invalid/expired.
 * - 500: `{ success: false, message: "Try again later." }` if an internal error occurs.
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, config.JWT_RESET_PASSWORD_SECRET);
    const user = await UserDAO.findById(decoded.userId);
    if(user.resetPasswordJti !== decoded.jti){
        return res.status(400).json({ success: false, message: "Enlace inválido o ya utilizado." });
    }

    if(newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)){
        return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" });
    }

    // Invalidate the token and update the password
    await UserDAO.updateResetPasswordJti(user._id, null);
    await UserDAO.updatePassword(user._id, newPassword);
    console.log(user.password)
    res.status(200).json({ success: true, message: "Contraseña actualizada." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Inténtalo de nuevo más tarde." , err: err.message});
  }
};
