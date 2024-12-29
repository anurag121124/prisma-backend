"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.verifyToken = exports.verifyTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use your secret key for JWT
// Middleware to verify JWT token
const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    try {
        const decodedToken = await (0, exports.verifyToken)(token);
        res.locals.firebaseId = decodedToken.uid;
        res.locals.email = decodedToken.email;
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
// Helper function to verify the JWT token
const verifyToken = async (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET); // Verify the token using the secret key
    }
    catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
// Helper function to generate JWT token
const additionalClaims = {
    premiumAccount: true
};
const generateToken = async (payload) => {
    try {
        // Create a JWT token with the payload and additional claims
        const token = jsonwebtoken_1.default.sign({ uid: payload.uid, email: payload.email, ...additionalClaims }, JWT_SECRET, {
            expiresIn: "1h", // You can set the expiration time as needed
        });
        console.log("JWT Token Generated:", token); // Log the generated token for debugging
        return token;
    }
    catch (error) {
        console.error("Error generating JWT token:", error);
        throw new Error("Unable to generate token");
    }
};
exports.generateToken = generateToken;