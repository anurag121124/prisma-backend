"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const winston_1 = require("winston");
// Ensure the logs directory exists
const logDir = 'logs';
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
// Define log format
const logFormat = winston_1.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});
// Create the logger
const logger = (0, winston_1.createLogger)({
    level: 'info', // Default logging level
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), // Capture stack trace for errors
    logFormat),
    transports: [
        // Log to the console with colors
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), // Add color to console logs
            logFormat),
        }),
        // Log to a file (info and above)
        new winston_1.transports.File({
            filename: `${logDir}/app.log`,
            level: 'info',
        }),
        // Log errors to a separate file
        new winston_1.transports.File({
            filename: `${logDir}/error.log`,
            level: 'error',
        }),
    ],
});
exports.logger = logger;
