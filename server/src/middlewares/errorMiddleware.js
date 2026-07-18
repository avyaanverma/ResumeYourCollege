// src/middlewares/errorMiddleware.js
import AppError from "../logger/appError.js";

const sendErrorDev = (err, res) => {
    // Development shows everything to help you debug
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // 1. Known Operational Errors (e.g., Validation failed, Route not found)
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // 2. Unknown Programming Errors or Third-Party Failures (Don't leak details!)
    else {
        // Log the actual error to your monitoring system (e.g., Sentry, Winston)
        console.error('💥 ERROR:', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong on our end.'
        });
    }
};

// The 4-argument signature tells Express this is the Global Error Handler
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        // Handle specific database or third-party library errors in production
        let error = { ...err, message: err.message };

        // Example: Handle Express JSON parsing error
        if (err.type === 'entity.parse.failed') {
            error = new AppError('Invalid JSON payload provided.', 400);
        }

        sendErrorProd(error, res);
    }
};
