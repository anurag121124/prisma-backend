import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use a strong secret in production
const JWT_EXPIRES_IN = "1h"; // Set token expiration

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): object | string => {
  return jwt.verify(token, JWT_SECRET);
};
