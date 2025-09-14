const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    error.statusCode = 404;
    next(error);
};
module.exports = notFound;
