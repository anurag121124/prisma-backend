import prisma from "../config/prisma";
import { User } from "../types/types"; // Ensure correct import with named export
import bcrypt from 'bcryptjs';
import { hashPassword } from "../utils/passwordUtils";
import { Jwt } from "jsonwebtoken";



export const loginUser = async (email: string, password: string) => {
  try {
    // Step 1: Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Step 2: If no user is found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Step 3: Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Step 4: If the password is invalid, throw an error
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Step 5: Return the user excluding sensitive information like password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error: any) {
    console.error("Error in loginUser:", error);
    throw new Error(`Error in loginUser: ${error.message}`);
  }
};

export const registerUser = async (user: User) => {
  const { firebaseId, email, fullName, socketId, password, mobile_number } = user;

  try {
    // Check if the user already exists by firebaseId or email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash the password (if necessary, though Firebase handles this)
    const hashedPassword = await hashPassword(password);
    console.log(hashPassword,"hashPassword")

    

    // Step 2: Create a new user in the database
    const newUser = await prisma.user.create({
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
  } catch (error: any) {
    console.error("Error in registerUser:", error);
    throw new Error(`Error in registerUser: ${error.message}`);
  }
};


