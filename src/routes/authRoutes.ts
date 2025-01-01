import { Router } from "express";
import { authLimiter } from "../middlewares/rateLimiter";
import { 
  getUsers, 
  getUserById, 
  register, 
  login 
} from "../controllers/authController";
import { registerCaptainController } from "../controllers/captainController";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";
import { authMiddleware } from "../utils/jwtUtils";
const router = Router();
 

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
  router.post("/auth/users/register", authLimiter, register);

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
router.post("/auth/users/login", authLimiter, login);

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
router.get("/users", verifyTokenMiddleware, authLimiter, getUsers);

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
router.get("/users/:userId", verifyTokenMiddleware,authLimiter, getUserById);

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
    router.post(
      "/auth/captain/register",
      [authMiddleware, authLimiter],
      registerCaptainController
    );
    

 export default router;
