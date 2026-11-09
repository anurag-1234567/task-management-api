// Log the method, URL, and time of every request
function logger(req, res, next) {
    const time = new Date().toISOString();

    console.log(`${req.method} ${req.originalUrl} - ${time}`);

    next();
}

module.exports = logger;
