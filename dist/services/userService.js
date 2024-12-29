"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwordUtils_1 = require("../utils/passwordUtils");
const loginUser = async (email, password) => {
    try {
        // Step 1: Find the user by email
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        // Step 2: If no user is found, throw an error
        if (!user) {
            throw new Error("User not found");
        }
        // Step 3: Compare the provided password with the stored hashed password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        // Step 4: If the password is invalid, throw an error
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        // Step 5: Return the user excluding sensitive information like password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        throw new Error(`Error in loginUser: ${error.message}`);
    }
};
exports.loginUser = loginUser;
const registerUser = async (user) => {
    const { firebaseId, email, fullName, socketId, password, mobile_number } = user;
    try {
        // Check if the user already exists by firebaseId or email
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        // Hash the password (if necessary, though Firebase handles this)
        const hashedPassword = await (0, passwordUtils_1.hashPassword)(password);
        console.log(passwordUtils_1.hashPassword, "hashPassword");
        // Step 2: Create a new user in the database
        const newUser = await prisma_1.default.user.create({
            data: {
                firebaseId,
                email,
                fullName,
                socketId,
                password: hashedPassword,
                mobile_number,
            },
        });
        return newUser;
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        throw new Error(`Error in registerUser: ${error.message}`);
    }
};
exports.registerUser = registerUser;
