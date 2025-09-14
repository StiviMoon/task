const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("../service/mailService");
const config = require("../config/environment");

/**
 * Registra un nuevo usuario en la base de datos.
 *
 * @async
 * @function register
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>} Devuelve un objeto JSON con:
 *  - 201: `{ message: user._id }` si el registro es exitoso.
 *  - 409: `{ message: "Este correo ya está registrado." }` si el email está duplicado.
 *  - 400: `{ message: error.message }` si ocurre un error de validación u otro.
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
 * Inicia sesión verificando las credenciales del usuario.
 *
 * @async
 * @function login
 * @param {Request} req
 * @param {Response} res
 * @returns { Promise<void>} Devuelve un objeto JSON con:
 *  - 200: `{ success: true, ,message: "Inicio de sesión exitoso."" ,token }` si las credenciales son correctas. y también manda el cookie.
 *  - 401: `{ success: false, message: "Correo o contraseña inválidos." }` si no coinciden email/contraseña.
 *  - 500: `{ success: false, message: err.message }` si ocurre un error interno.
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

    // Enviar el token en una cookie segura
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Siempre true para HTTPS
        sameSite: "none", // Siempre none para cross-origin
        maxAge: 2 * 60 * 60 * 1000,
        path: "/",
    });

    res.status(200).json({ success: true, message: "Inicio de sesión exitoso." });
  }

  catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Cierra la sesión del usuario eliminando la cookie del token.
 * @function logout
 * @param {Request} req
 *
 * @param {Response}  res
 * @returns {void} Devuelve un objeto JSON con:
 *  - 200: `{ message: "Sesión cerrada exitosamente." }` si la cookie se elimina correctamente.
 *  - 400: `{ message: error.message }` si ocurre un error interno.
 */

exports.logout = (req, res) => {
    try{
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true, // Siempre true para HTTPS
            sameSite: "none", // Siempre none para cross-origin
            path: "/",
        });

        res.status(200).json({ success: true, message: "Sesión cerrada exitosamente." });
    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }

};



/** * Envía un correo electrónico con un enlace para restablecer la contraseña.
 *
 * @async
 * @function forgotPassword
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>} Devuelve un objeto JSON con:
 *  - 200: `{ success: true, message: "Si el correo existe, se ha enviado un enlace de restablecimiento." }` si el proceso es exitoso.
 * - 500: `{ success: false, message: err.message }` si ocurre un error interno.
 * /
**/


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

    await sendMail({
        to: email,
        subject: "Restablecimiento de contraseña",
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

/**
 * Restablece la contraseña del usuario utilizando un token JWT.
 * @async
 * @function resetPassword
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}  Devuelve un objeto JSON con:
 *  - 200: `{ success: true, message: "Contraseña actualizada." }` si la contraseña se actualiza correctamente.
 * - 400: `{ success: false, message: "Enlace inválido o ya utilizado." }` si el token es inválido o ya fue usado.
 * - 500: `{ success: false, message: err.message }` si ocurre un error interno.
 *
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


    user.password = newPassword;

    await user.save();
    console.log(user.password)
    res.status(200).json({ success: true, message: "Contraseña actualizada." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Inténtalo de nuevo más tarde." , err: err.message});
  }
};
