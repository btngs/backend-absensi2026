class AppError extends Error {
    constructor(message, statusCode = 500, details = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

const notFoundHandler = (req, res, next) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);

    const statusCode = err.statusCode || err.status || 500;

    const response = {
        message: err.message || 'Internal server error'
    };

    if (err.details) {
        response.errors = err.details;
    }

    res.status(statusCode).json(response);
};

module.exports = {
    AppError,
    notFoundHandler,
    errorHandler
};
