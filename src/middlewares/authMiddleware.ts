import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";


export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // Remove the 'return' here to fix the type error
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // Ensure the middleware stops after sending the response
  }

  try {
    const decodedToken = await verifyToken(token);
    res.locals.firebaseId = decodedToken.uid;
    res.locals.email = decodedToken.email;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
// Helper function to verify Firebase ID token
export const verifyToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Helper function to generate Firebase custom token
export const generateToken = async (payload: { uid: string; [key: string]: any }): Promise<string> => {
  try {
    return await admin.auth().createCustomToken(payload.uid, { ...payload });
  } catch (error) {
    console.error("Error generating Firebase custom token:", error);
    throw new Error("Unable to generate token");
  }
};