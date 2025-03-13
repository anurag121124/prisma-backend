import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use your secret key for JWT

// Middleware to verify JWT token
export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decodedToken = await verifyToken(token);
    
    if (typeof decodedToken === "string") {
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    res.locals.firebaseId = decodedToken.uid;
    res.locals.email = decodedToken.email;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Helper function to verify the JWT token
export const verifyToken = async (token: string): Promise<JwtPayload | string> => {
  try {
    return jwt.verify(token, JWT_SECRET); // Verify the token using the secret key
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Helper function to generate JWT token
const additionalClaims = {
  premiumAccount: true
};

export const generateToken = async (payload: { uid: string; email: string }): Promise<string> => {
  try {
    // Create a JWT token with the payload and additional claims
    return jwt.sign({ uid: payload.uid, email: payload.email, ...additionalClaims }, JWT_SECRET, {
      expiresIn: "1h", // You can set the expiration time as needed
    });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Unable to generate token");
  }
};
