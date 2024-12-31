import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { getUsers, getUserById, register, login } from "../controllers/authController";
import { registerCaptainController } from "../controllers/captainController";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";
import { authMiddleware } from "../utils/jwtUtils";

class AuthRouter {
  public router = Router();
  
  private authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { status: 'error', message: 'Too many auth requests.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  private generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { status: 'error', message: 'Request limit exceeded.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
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
    this.router.post("/auth/users/register", this.authLimiter, register);

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
    this.router.post("/auth/users/login", this.authLimiter, login);

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
    this.router.get("/users", verifyTokenMiddleware, this.generalLimiter, getUsers);

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
    this.router.get("/users/:userId", verifyTokenMiddleware, this.generalLimiter, getUserById);

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
    this.router.post("/auth/captain/register", [authMiddleware, this.authLimiter], registerCaptainController);
  }
}

export default new AuthRouter().router;