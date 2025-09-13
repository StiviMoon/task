const User = require("../models/User");





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