const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",            // Si es cross-site cookie colocar: None
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
 * @param {Response}  res
 * @returns {void} Devuelve un objeto JSON con:
 *  - 200: `{ message: "Sesión cerrada exitosamente." }` si la cookie se elimina correctamente.
 *  - 400: `{ message: error.message }` si ocurre un error interno.
 */

exports.logout = (req, res) => {
    try{
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", 
            path: "/", 
        });
        
        res.status(200).json({ success: true, message: "Sesión cerrada exitosamente." });
    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }

};







