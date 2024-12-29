import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Custom interface for extended request object
interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Environment variables should be validated at startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Generates a JWT token with the provided payload.
 * @param payload - The data to include in the token
 * @returns The signed JWT token
 * @throws Error if token generation fails
 */
export const generateToken = (payload: object): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: "HS256" // Explicitly specify the algorithm
    });
  } catch (error) {
    throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Verifies and decodes the provided JWT token.
 * @param token - The JWT token to verify
 * @returns The decoded token payload
 * @throws Error if token is invalid or verification fails
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"] // Explicitly specify allowed algorithms
    });
    
    // Ensure the decoded token is a JwtPayload
    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};



/**
 * Middleware to authenticate requests using JWT tokens.
 * Adds the decoded user payload to the request object if authentication is successful.
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization header missing or invalid format"
      });
      return;
    }

    const token = authHeader.slice(7).trim();
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token is missing"
      });
      return;
    }

    // Verify and decode the token
    const decoded = verifyToken(token);
    
    // Attach the decoded payload to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Authentication failed"
    });
  }
};