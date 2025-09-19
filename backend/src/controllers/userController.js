const UserDAO = require("../dao/UserDAO");

/**
 * Edits the profile of the authenticated user.
 *
 * @async
 * @function editProfile
 * @param {Request} req Express request object. Must include `req.user` from the `authenticateToken` middleware.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 * 
 * - 200: `{ success: true, user: { id, email, name, lastName, age, updatedAt } }`  
 *   If the update is successful.
 * - 404: `{ success: false, message: "Usuario no encontrado." }`  
 *   If the user does not exist.
 * - 409: `{ success: false, message: "Este correo ya está registrado." }`  
 *   If the email is already in use.
 * - 400: `{ success: false, message: error.message }`  
 *   If validation fails or another error occurs.
 * - 401: Unauthorized (handled by the `authenticateToken` middleware).
 */

exports.editProfile = async (req, res) => {
    try {          
        const userId = req.user.userId;
        const { name, email , lastName, age } = req.body;
        const updatedUser = await UserDAO.updateById(userId, { name,email, lastName, age });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }
        res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                lastName: updatedUser.lastName,
                age: updatedUser.age,
                updatedAt: updatedUser.updatedAt
            }
        });
    } 
    catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ success: false, message: "Este correo ya está registrado." });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};


/**
 * Retrieves the profile of the currently authenticated user.
 *
 * @async
 * @function getProfile
 * @param {Request} req Express request object. Must include `req.user` from the `authenticateToken` middleware.
 * @param {Response} res Express response object.
 * @returns {Promise<void>} Returns a JSON response with:
 * 
 * - 200: `{ success: true, user: profile }`  
 *   If the profile is found.
 * - 404: `{ success: false, message: "Usuario no encontrado." }`  
 *   If the user profile does not exist.
 * - 400: `{ success: false, message: error.message }`  
 *   If an error occurs.
 * - 401: Unauthorized (handled by the `authenticateToken` middleware).
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await UserDAO.getUserProfile(userId);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }

        res.status(200).json({ success: true, user: profile });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
