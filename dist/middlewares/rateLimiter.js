"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { status: 'error', message: 'Too many auth requests.' },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.generalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000,
    max: 10,
    message: { status: 'error', message: 'Request limit exceeded.' },
    standardHeaders: true,
    legacyHeaders: false,
});
