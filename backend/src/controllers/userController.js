const UserDAO = require("../dao/UserDAO");

/**
 * Edits the profile of the authenticated user.
 *
 * @async
 * @function editProfile
 * @param {Request} req - Must include `req.user` from the `authenticateToken` middleware.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON object with:
 * - 200: `{ success: true, user: { id, email, name, lastName, age } }` if the update is successful.
 * - 400: `{ success: false, message: error.message }` if a validation or other error occurs.
 * - 401: Unauthorized, if the user is not authenticated (handled by `authenticateToken` middleware).
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
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with:
 * - 200: `{ success: true, user: profile }` if the profile is found.
 * - 404: `{ success: false, message: "User not found." }` if no profile exists.
 * - 400: `{ success: false, message: error.message }` on unexpected errors.
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
