"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
class AuthError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 400, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
