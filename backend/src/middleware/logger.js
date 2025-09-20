const logger = (req, res, next) => {
    const start = Date.now();

    // Log más detallado para debugging móvil
    console.log(`📥 ${req.method} ${req.originalUrl}`);
    console.log(`   IP: ${req.ip}`);
    console.log(`   User-Agent: ${req.get('User-Agent')?.substring(0, 100)}...`);
    console.log(`   Origin: ${req.get('Origin') || 'No origin'}`);
    console.log(`   Time: ${new Date().toISOString()}`);

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
