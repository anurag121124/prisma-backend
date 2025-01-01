"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const authController_1 = require("../controllers/authController");
const captainController_1 = require("../controllers/captainController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const jwtUtils_1 = require("../utils/jwtUtils");
const router = (0, express_1.Router)();
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
router.post("/auth/users/register", rateLimiter_1.authLimiter, authController_1.register);
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
router.post("/auth/users/login", rateLimiter_1.authLimiter, authController_1.login);
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
router.get("/users", authMiddleware_1.verifyTokenMiddleware, rateLimiter_1.authLimiter, authController_1.getUsers);
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
router.get("/users/:userId", authMiddleware_1.verifyTokenMiddleware, rateLimiter_1.authLimiter, authController_1.getUserById);
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
router.post("/auth/captain/register", [jwtUtils_1.authMiddleware, rateLimiter_1.authLimiter], captainController_1.registerCaptainController);
exports.default = router;
