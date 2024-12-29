"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Environment variables should be validated at startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
/**
 * Generates a JWT token with the provided payload.
 * @param payload - The data to include in the token
 * @returns The signed JWT token
 * @throws Error if token generation fails
 */
const generateToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            algorithm: "HS256" // Explicitly specify the algorithm
        });
    }
    catch (error) {
        throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.generateToken = generateToken;
/**
 * Verifies and decodes the provided JWT token.
 * @param token - The JWT token to verify
 * @returns The decoded token payload
 * @throws Error if token is invalid or verification fails
 */
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            algorithms: ["HS256"] // Explicitly specify allowed algorithms
        });
        // Ensure the decoded token is a JwtPayload
        if (typeof decoded === "string") {
            throw new Error("Invalid token payload");
        }
        return decoded;
    }
    catch (error) {
        throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.verifyToken = verifyToken;
/**
 * Middleware to authenticate requests using JWT tokens.
 * Adds the decoded user payload to the request object if authentication is successful.
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authorization header missing or invalid format"
            });
            return;
        }
        const token = authHeader.slice(7).trim();
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token is missing"
            });
            return;
        }
        // Verify and decode the token
        const decoded = (0, exports.verifyToken)(token);
        // Attach the decoded payload to the request object
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Authentication failed"
        });
    }
};
exports.authMiddleware = authMiddleware;
