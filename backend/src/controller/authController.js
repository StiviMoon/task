const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("../service/resendService");
const config = require("../config/environment");

/**
 * Registers a new user in the database.
 *
 * @async
 * @function register
 * @param {Request} req - Express request object containing user data.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 *  - 201: `{ userId: user._id }` if registration is successful.
 *  - 409: `{ message: "This email is already registered." }` if the email is duplicated.
 *  - 400: `{ message: error.message }` if a validation or other error occurs.
 */
exports.register = async (req, res) => {
    try{
        const { name, lastName, age, email, password } = req.body;

        const user = new User({ name, lastName, age, email, password });
        await user.save();
        res.status(201).json({ userId: user._id });
    }
    catch(error){
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(409).json({
                message: "Este correo ya está registrado."
            });
        }
        res.status(400).json({ message: error.message });
    }
}



/**
 * Logs in a user by verifying credentials.
 *
 * @async
 * @function login
 * @param {Request} req - Express request object with email and password.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 *  - 200: `{ success: true, message: "Login successful.", token }` if credentials are correct (also sets a cookie).
 *  - 401: `{ success: false, message: "Invalid email or password." }` if credentials do not match.
 *  - 500: `{ success: false, message: err.message }` if an internal error occurs.
 */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ success: false, message: 'Correo o contraseña inválidos' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({ success: false, message: 'Correo o contraseña inválidos' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Send token in a secure cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: isProduction, // true para HTTPS en producción
        sameSite: isProduction ? "none" : "lax", // none para cross-origin en producción
        maxAge: 2 * 60 * 60 * 1000, // 2 horas
        path: "/",
    });

    res.status(200).json({ success: true, message: "Inicio de sesión exitoso." });
  }

  catch (err) {
    res.status(500).json({ success: false, message: "Inténtalo de nuevo más tarde." });
  }
};

/**
 * Logs out a user by clearing the authentication cookie.
 *
 * @function logout
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void} Returns a JSON response with:
 *  - 200: `{ message: "Logout successful." }` if the cookie is cleared.
 *  - 400: `{ message: error.message }` if an internal error occurs.
 */

exports.logout = (req, res) => {
    try{
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: isProduction, // true para HTTPS en producción
            sameSite: isProduction ? "none" : "lax", // none para cross-origin en producción
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
 * @param {Request} req - Express request object (must contain `req.user` set by authenticateToken middleware).
 * @param {Response} res - Express response object.
 * @returns {void} Returns a JSON response with:
 *  - 200: `{ success: true, user: { id, email } }` if the user is authenticated.
 *  - 401: If the user is not authenticated (handled by middleware).
 */
exports.verifyAuth = (req, res) => {
    try {
        // Si llegamos aquí, el middleware authenticateToken ya verificó que el token es válido
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
 * @param {Request} req - Express request object containing the user's email.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 *  - 200: `{ success: true, message: "If the email exists, a reset link has been sent." }` if successful.
 *  - 202: `{ success: false, message: "Email not registered." }` if the user does not exist.
 *  - 500: `{ success: false, message: err.message }` if an internal error occurs.
 */


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(202).json({ success: false, message: "Correo no registrado." });
    }
    const jwtid = Math.random().toString(36).substring(2);
    const resetToken = jwt.sign(
      { userId: user._id },
      config.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: '1h' , jwtid }
    );

    user.resetPasswordJti = jwtid;
    await user.save();

    const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // En desarrollo, enviar a email verificado de Resend
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
 * Resets the user's password using a JWT token.
 *
 * @async
 * @function resetPassword
 * @param {Request} req - Express request object containing token and new password.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 *  - 200: `{ success: true, message: "Password updated." }` if the password is successfully updated.
 *  - 400: `{ success: false, message: "Invalid or already used link." }` if the token is invalid or reused.
 *  - 500: `{ success: false, message: err.message }` if an internal error occurs.
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, config.JWT_RESET_PASSWORD_SECRET);
    const user = await User.findById(decoded.userId);
    if(user.resetPasswordJti !== decoded.jti){
        return res.status(400).json({ success: false, message: "Enlace inválido o ya utilizado." });
    }

    if(newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)){
        return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" });
    }

    user.resetPasswordJti = null; // Invalida el token después de usarlo
    user.password = newPassword;

    await user.save();
    console.log(user.password)
    res.status(200).json({ success: true, message: "Contraseña actualizada." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Inténtalo de nuevo más tarde." , err: err.message});
  }
};
