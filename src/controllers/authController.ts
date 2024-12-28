import { Request, Response, NextFunction } from "express";
import { registerUser } from "../services/userService";
import { v4 as uuidv4 } from "uuid"; // For generating unique identifiers, if needed
import admin from "../config/firebase";
import { User } from "../types/user_type";
import prisma from "../config/prisma";
import { z } from "zod"; // Import Zod for validation

// Define the schema for request validation
const registerSchema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
  fullName: z.string().nonempty("Full name is required"),
  socketId: z.string().nonempty("Socket ID is required"),
  mobile_number: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid mobile number format").nonempty("Mobile number is required"),
});

// The `register` function handles user registration
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1: Validate the incoming request body using Zod
    const validatedData = registerSchema.parse(req.body);

    const { email, password, fullName, socketId, mobile_number } = validatedData;

    // Step 2: Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return; // Ensure the function exits here
    }

    // Step 3: Create the user in Firebase Authentication
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
    });

    // Step 4: Save the user in the database
    const user: User = {
      firebaseId: firebaseUser.uid,
      email,
      fullName,
      socketId,
      password, // Firebase already hashes the password
      mobile_number,
    };

    const newUser = await registerUser(user);

    // Step 5: Respond with user details (excluding sensitive info)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id, // Assuming `registerUser` returns the user including the database ID
        email: newUser.email,
        firebaseId: newUser.firebaseId,
        fullName: newUser.fullName,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
      });
      return; // Exit the function after responding
    }

    if (error.code === "auth/email-already-exists") {
      res.status(409).json({ message: "Email is already registered" });
      return; // Exit the function after responding
    }

    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Get the user identifier (firebaseId or email) from the request parameters or query
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    
    // Step 2: Fetch the user details from the database using Prisma (based on firebaseId or email)
    const user = await prisma.user.findUnique({
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
  } catch (error :any) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Fetch all users from the database using Prisma
    const users = await prisma.user.findMany();

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
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
