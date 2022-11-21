const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (error, req, res, next) => {
    let errorResponse = { ...error };
    errorResponse.message = error.message;

    console.log(error.stack.red);
    
    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
        const message = `Entry not found with ID of ${ error.value }`;
        errorResponse = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
        const message = `Duplicate field value entered`;
        errorResponse = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((error) => error.message);
        errorResponse = new ErrorResponse(message, 400);
    }

    res.status(errorResponse.statusCode || 500).json({
        success: false,
        error: errorResponse.message || 'Server Error'
    });
};

module.exports = errorHandler
