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
    if (err.statusCode < 500) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.errors?.length ? { errors: err.errors } : {}),
        });
    }
    // 2. Unknown Programming Errors or Third-Party Failures (Don't leak details!)
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong on our end.'
        });
    }
};

// The 4-argument signature tells Express this is the Global Error Handler
export default (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || (err.statusCode < 500 ? 'fail' : 'error');

    const logLevel = err.statusCode >= 500 ? 'error' : 'warn';
    req.log[logLevel](
        { err, statusCode: err.statusCode },
        'Request failed'
    );

    if (res.headersSent) {
        return _next(err);
    }

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
