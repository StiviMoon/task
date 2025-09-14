/**
* HTTP request logging middleware.
* 
* This middleware logs information about each request that reaches the server to the console,
* including the HTTP method, the requested URL, the client IP address, the date and time of the request,
* the response status code, and the time it took to process.
* 
* @param {import('express').Request} req - HTTP request object.
* @param {import('express').Response} res - HTTP response object.
* @param {Function} next - Function that calls the next middleware in the chain.
*/
const logger = (req, res, next) => {
    const start = Date.now();

    console.log(`📥 ${req.method} ${req.originalUrl} - ${req.ip} - ${new Date().toISOString()}`);

    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '❌' : '✅';

        console.log(`${statusColor} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);

        originalEnd.call(this, chunk, encoding);
    };

    next();
};

module.exports = logger;
