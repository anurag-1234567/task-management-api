// Handle errors from all routes and controllers in one place
function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || error.status || 500;

    // Send a safe message instead of internal server details
    const message = statusCode >= 500
        ? 'Something went wrong on the server.'
        : error.message;

    console.error(error.message);

    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = errorHandler;
