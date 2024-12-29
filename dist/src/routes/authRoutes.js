"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const captainController_1 = require("../controllers/captainController");
const jwtUtils_1 = require("../utils/jwtUtils");
const router = express_1.default.Router();
// Rate limiter setup
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many requests, please try again later.",
    statusCode: 429,
});
// Routes with rate limiter and middleware
/**
 * @swagger
 * /register:
 *   post:
 *     description: Register a new user
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post("/register", limiter, authController_1.register);
/**
 * @swagger
 * /login:
 *   post:
 *     description: Login an existing user
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", limiter, authController_1.login);
/**
 * @swagger
 * /user:
 *   get:
 *     description: Get a list of users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", authController_1.getUsers);
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     description: Get user details by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/user/:userId", limiter, authController_1.getUserById, authMiddleware_1.verifyTokenMiddleware);
router.post("/register/captain", limiter, captainController_1.registerCaptainController), jwtUtils_1.authMiddleware;
exports.default = router;
