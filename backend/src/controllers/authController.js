const UserDAO = require("../dao/UserDAO");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("../service/resendService");
const config = require("../config/environment");

/**
* Registers a new user in the database.
*
* @async
* @function registration
* @param {import('express').Request} req Express HTTP request object.
* @param {import('express').Response} res Express HTTP response object.
* @returns {Promise<void>} Does not return directly; sends a JSON response.
*
* @throws {409} If the email is already registered. Response: `{ message: "This email is already registered." }`
* @throws {400} If a validation or other error occurs. Response: `{ message: error.message }`
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
 * @param {Request} req Request object containing `email` and `password` in the body.
 * @param {Response} res Response object used to return the result.
 * @returns {Promise<void>} Returns a JSON object with the authentication result:
 * 
 * - 200: `{ success: true, message: "Inicio de sesión exitoso.", token }`  
 *   If the credentials are correct. A cookie with the JWT is also sent.
 *
 * - 401: `{ success: false, message: "Correo o contraseña inválidos." }`  
 *   If the email or password does not match.
 *
 * - 500: `{ success: false, message: "Inténtalo de nuevo más tarde." }`  
 *   If an internal server error occurs.
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
        secure: false, // HTTP and HTTPS in all environments for universal testing
        sameSite: "lax", // Maximum cross-browser compatibility
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
 * Logs out the user by clearing the access token cookie.
 * 
 * @function logout
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @returns {void} Returns a JSON object with:
 * 
 * - 200: `{ success: true, message: "Sesión cerrada exitosamente." }`  
 *   If the cookie was successfully cleared.
 * - 400: `{ success: false, message: error.message }`  
 *   If an internal error occurs.
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
 * @param {Request} req Express request object (must include `req.user` from the `authenticateToken` middleware).
 * @param {Response} res Express response object.
 * @returns {void} Returns a JSON object with:
 * 
 * - 200: `{ success: true, user: { id, email } }`  
 *   If the user is authenticated.
 * - 401: Unauthorized (handled by `authenticateToken` middleware).  
 * - 500: `{ success: false, message: error.message }`  
 *   If an internal error occurs.
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
 * Sends an email with a password reset link.
 *
 * @async
 * @function forgotPassword
 * @param {Request} req Express request object containing the user email.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * 
 * - 200: `{ success: true, message: "Si el correo existe, se ha enviado un enlace de restablecimiento." }`  
 *   If the process completes successfully.
 * - 202: `{ success: false, message: "Correo no registrado." }`  
 *   If the email is not registered.
 * - 500: `{ success: false, message: err.message }`  
 *   If an internal error occurs.
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
 * Resets the user’s password using a JWT reset token.
 *
 * @async
 * @function resetPassword
 * @param {Request} req Express request object containing `token` and `newPassword`.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * 
 * - 200: `{ success: true, message: "Contraseña actualizada." }`  
 *   If the password was updated successfully.
 * - 400: `{ success: false, message: "Enlace inválido o ya utilizado." }`  
 *   If the token is invalid, expired, or already used.
 * - 400: `{ success: false, message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" }`  
 *   If the new password does not meet security requirements.
 * - 500: `{ success: false, message: "Inténtalo de nuevo más tarde.", err: err.message }`  
 *   If an internal error occurs.
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

/**
 * Retrieves the profile of the authenticated user.
 *
 * @async
 * @function getUserProfile
 * @param {Request} req - Express request object containing `userId` in `req.user`.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 *  - 200: `{ success: true, user: userProfile }` 
 * if retrieved successfully.
 *  - 404: `{ success: false, message: "User not found." }` 
 * if the user does not exist.
 *  - 500: `{ success: false, message: error.message }` 
 * if an internal error occurs.
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userProfile = await UserDAO.getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
    }

    res.status(200).json({
      success: true,
      user: userProfile
    });
  } catch (err) {
    if (config.NODE_ENV === "development") {
      console.error(err);
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
};

/**
 * Updates the authenticated user's profile.
 *
 * @async
 * @function updateUserProfile
 * @param {Request} req - Request object con userId en req.user
 * @param {Response} res - Response object
 * @returns {Promise<void>} Returns a JSON object with:
 *  - 200: `{ success: true, user: updatedUser }` if updated successfully.
 *  - 400: `{ success: false, message: error.message }` if there are validation errors.
 *  - 404: `{ success: false, message: "Usuario no encontrado." }` if the user does not exist.
 *  - 500: `{ success: false, message: error.message }`if an internal error occurs.
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, lastName, age, email } = req.body;

    // Verify that the user exists
    const existingUser = await UserDAO.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
    }

    // Check if the email already exists for another user
    if (email && email !== existingUser.email) {
      const emailExists = await UserDAO.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Este correo ya está registrado por otro usuario."
        });
      }
    }

    // Update the user
    const updatedUser = await UserDAO.updateById(userId, {
      name,
      lastName,
      age,
      email
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
    }

    // Get the updated profile (without sensitive data)
    const userProfile = await UserDAO.getUserProfile(userId);

    res.status(200).json({
      success: true,
      user: userProfile,
      message: "Perfil actualizado exitosamente."
    });
  } catch (err) {
    if (config.NODE_ENV === "development") {
      console.error(err);
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
};
