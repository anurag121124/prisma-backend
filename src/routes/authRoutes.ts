import express from "express";
import { getUsers, getUserById, register, login } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter setup
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.", // Custom error message
  statusCode: 429, // HTTP status code for too many requests
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
router.post("/register", limiter, register);

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login an existing user
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", limiter, login);

/**
 * @swagger
 * /user:
 *   get:
 *     description: Get a list of users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/user", limiter, getUsers);

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
router.get("/user/:userId", limiter, getUserById);

export default router;
