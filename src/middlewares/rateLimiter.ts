import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { status: 'error', message: 'Too many auth requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { status: 'error',  message: 'Request limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});
