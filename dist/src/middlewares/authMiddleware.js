"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Get token from the Authorization header
    // If no token is provided, respond with Unauthorized status
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(token); // Verify token with Firebase Admin SDK
        // Optional: Check for a specific claim to allow registration (e.g., custom claims)
        if (!decodedToken.email_verified) {
            res.status(403).json({ message: "Email not verified" }); // Deny registration if email is unverified
            return;
        }
        // Attach Firebase ID and email to the response locals for downstream use
        res.locals.firebaseId = decodedToken.uid;
        res.locals.email = decodedToken.email;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Error verifying token for registration:", error);
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.verifyToken = verifyToken;
