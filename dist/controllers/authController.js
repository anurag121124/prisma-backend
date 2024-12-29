"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUserById = exports.register = exports.login = void 0;
const userService_1 = require("../services/userService");
const firebase_1 = __importDefault(require("../config/firebase"));
const prisma_1 = __importDefault(require("../config/prisma"));
const zod_1 = require("zod"); // Import Zod for validation
const jwtUtils_1 = require("../utils/jwtUtils");
// Define the schema for request validation
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").nonempty("Email is required"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .nonempty("Password is required"),
    fullName: zod_1.z.string().nonempty("Full name is required"),
    socketId: zod_1.z.string().nonempty("Socket ID is required"),
    mobile_number: zod_1.z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid mobile number format").nonempty("Mobile number is required"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").nonempty("Email is required"),
    password: zod_1.z.string().nonempty("Password is required"),
});
const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        // Authenticate the user
        const user = await (0, userService_1.loginUser)(email, password);
        // Generate JWT token
        const token = (0, jwtUtils_1.generateToken)({ id: user.id, email: user.email });
        res.status(200).json({
            message: "User logged in successfully",
            token, // Send the token to the client
            user: {
                id: user.id,
                email: user.email,
                firebaseId: user.firebaseId,
                fullName: user.fullName,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
            });
            return;
        }
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
// The `register` function handles user registration
const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { email, password, fullName, socketId, mobile_number } = validatedData;
        const firebaseUser = await firebase_1.default.auth().createUser({ email, password });
        const user = {
            firebaseId: firebaseUser.uid,
            email,
            fullName,
            socketId,
            password,
            mobile_number,
        };
        const newUser = await (0, userService_1.registerUser)(user);
        // Generate JWT token
        const token = (0, jwtUtils_1.generateToken)({ id: newUser.id, email: newUser.email });
        res.status(201).json({
            message: "User registered successfully",
            token, // Send the token to the client
            user: {
                id: newUser.id,
                email: newUser.email,
                firebaseId: newUser.firebaseId,
                fullName: newUser.fullName,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
            });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};
exports.register = register;
const getUserById = async (req, res) => {
    try {
        // Step 1: Get the user identifier (firebaseId or email) from the request parameters or query
        const { userId } = req.params; // Assuming userId is passed as a URL parameter
        // Step 2: Fetch the user details from the database using Prisma (based on firebaseId or email)
        const user = await prisma_1.default.user.findUnique({
            where: { firebaseId: userId }, // Adjust this to find by email or another field if needed
        });
        // Step 3: If user is not found, respond with a 404 error
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; // Exit the function
        }
        // Step 4: Respond with the user details, excluding sensitive information like password
        res.status(200).json({
            message: "User retrieved successfully",
            user: {
                id: user.id,
                email: user.email,
                firebaseId: user.firebaseId,
                fullName: user.fullName,
                socketId: user.socketId,
                mobile_number: user.mobile_number,
            },
        });
    }
    catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getUserById = getUserById;
const getUsers = async (req, res) => {
    try {
        // Step 1: Fetch all users from the database using Prisma
        const users = await prisma_1.default.user.findMany();
        // Step 2: If no users are found, respond with a 404 error
        if (users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return; // Exit the function
        }
        // Step 3: Respond with the user details, excluding sensitive information like password
        res.status(200).json({
            message: "Users retrieved successfully",
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                firebaseId: user.firebaseId,
                fullName: user.fullName,
                socketId: user.socketId,
                mobile_number: user.mobile_number,
            })),
        });
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getUsers = getUsers;
