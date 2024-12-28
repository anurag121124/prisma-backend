
import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from the Authorization header

  // If no token is provided, respond with Unauthorized status
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify token with Firebase Admin SDK

    // Optional: Check for a specific claim to allow registration (e.g., custom claims)
    if (!decodedToken.email_verified) {
      res.status(403).json({ message: "Email not verified" }); // Deny registration if email is unverified
      return;
    }

    // Attach Firebase ID and email to the response locals for downstream use
    res.locals.firebaseId = decodedToken.uid;
    res.locals.email = decodedToken.email;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token for registration:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
