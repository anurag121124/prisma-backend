"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCaptainController = exports.registerCaptainController = void 0;
const captainService_1 = require("../services/captainService");
const validation_1 = require("../utils/validation");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const registerCaptainController = async (req, res, next) => {
    try {
        const validatedData = validation_1.registerSchemaCaptain.parse(req.body);
        const { sanitizedCaptain, token } = await (0, captainService_1.registerCaptain)(validatedData);
        res.status(201).json({
            success: true,
            message: 'Captain registered successfully',
            data: sanitizedCaptain,
            token,
        });
    }
    catch (error) {
        logger_1.logger.error('Error in registerCaptainController:', error); // Log error details
        if (error instanceof errors_1.AuthError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        else {
            next(error);
        }
    }
};
exports.registerCaptainController = registerCaptainController;
const loginCaptainController = async (req, res, next) => {
    try {
        const validatedData = validation_1.loginSchema.parse(req.body); // Validate input data
        const result = await (0, captainService_1.loginCaptain)(validatedData); // Pass validated login data to the service
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    }
    catch (error) {
        if (error instanceof errors_1.AuthError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};
exports.loginCaptainController = loginCaptainController;
