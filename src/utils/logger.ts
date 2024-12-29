import fs from 'fs';
import { createLogger, format, transports } from 'winston';

// Ensure the logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Default logging level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Capture stack trace for errors
    logFormat
  ),
  transports: [
    // Log to the console with colors
    new transports.Console({
      format: format.combine(
        format.colorize(), // Add color to console logs
        logFormat
      ),
    }),

    // Log to a file (info and above)
    new transports.File({
      filename: `${logDir}/app.log`,
      level: 'info',
    }),

    // Log errors to a separate file
    new transports.File({
      filename: `${logDir}/error.log`,
      level: 'error',
    }),
  ],
});

// Export the logger
export { logger };
