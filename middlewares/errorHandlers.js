import { DEBUG_MODE } from "../config/index.js";
import Joi from 'joi';
import customErrorHandler from "../services/customErrorHandler.js";
const { ValidationError } = Joi;

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: 'Internal Server Error',
        ...(DEBUG_MODE === 'true' && { originalError: err.message }) // Don't send when in production only for dev purpose
    }
    if (err instanceof ValidationError) {
        // ValidationError is a class in validation (joi) so checking if err is an instance of that validation
        statusCode = 422;  // 422 is used for validation errors
        data = {
            message: err.message
        }
    }
    if (err instanceof customErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }
    return res.status(statusCode).json(data);
}

export default errorHandler;