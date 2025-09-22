/**
 * Express middleware for handling 404 "Not Found" errors.
 * Creates an error object with a descriptive message when 
 * the requested route does not exist and passes it to the next error handler.
 *
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Callback to pass control to the next middleware.
 * @returns {void}
 */
const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    error.statusCode = 404;
    next(error);
};
module.exports = notFound;
