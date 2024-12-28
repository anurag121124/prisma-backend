import prisma from "../config/prisma";
import { User } from "../types/user_type"; // Ensure correct import with named export
import bcrypt from 'bcryptjs';
import { hashPassword } from "../utils/passwordUtils";
// Find or create a user based on Firebase ID and email
// export const findOrCreateUser = async (firebaseId: string, email: string) => {
//   try {
//     let user = await prisma.user.findUnique({ where: { firebaseId } });
//     if (!user) {
//       user = await prisma.user.create({
//         data: { firebaseId, email },
//       });
//     }
//     return user;
//   } catch (error) {
//     throw new Error(`Error in findOrCreateUser: ${error.message}`);
//   }
// };


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


