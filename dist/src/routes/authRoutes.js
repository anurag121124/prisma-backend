"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = require("express-rate-limit");
const authController_1 = require("../controllers/authController");
const captainController_1 = require("../controllers/captainController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const jwtUtils_1 = require("../utils/jwtUtils");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authLimiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 15 * 60 * 1000,
            max: 5,
            message: { status: 'error', message: 'Too many auth requests.' },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.generalLimiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 60 * 1000,
            max: 10,
            message: { status: 'error', message: 'Request limit exceeded.' },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        /**
         * @swagger
         * /auth/users/register:
         *   post:
         *     summary: Register a new user
         *     tags: [Users]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: User registered successfully
         *       429:
         *         description: Too many auth requests
         */
        this.router.post("/auth/users/register", this.authLimiter, authController_1.register);
        /**
         * @swagger
         * /auth/users/login:
         *   post:
         *     summary: Login a user
         *     tags: [Users]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: User logged in successfully
         *       429:
         *         description: Too many auth requests
         */
        this.router.post("/auth/users/login", this.authLimiter, authController_1.login);
        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Get all users
         *     tags: [Users]
         *     responses:
         *       200:
         *         description: A list of users
         *       401:
         *         description: Unauthorized
         *       429:
         *         description: Request limit exceeded
         */
        this.router.get("/users", authMiddleware_1.verifyTokenMiddleware, this.generalLimiter, authController_1.getUsers);
        /**
         * @swagger
         * /users/{userId}:
         *   get:
         *     summary: Get user by ID
         *     tags: [Users]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: User details
         *       401:
         *         description: Unauthorized
         *       429:
         *         description: Request limit exceeded
         */
        this.router.get("/users/:userId", authMiddleware_1.verifyTokenMiddleware, this.generalLimiter, authController_1.getUserById);
        /**
         * @swagger
         * /auth/captain/register:
         *   post:
         *     summary: Register a new captain
         *     tags: [Captains]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: Captain registered successfully
         *       401:
         *         description: Unauthorized
         *       429:
         *         description: Too many auth requests
         */
        this.router.post("/auth/captain/register", [jwtUtils_1.authMiddleware, this.authLimiter], captainController_1.registerCaptainController);
    }
}
exports.default = new AuthRouter().router;
