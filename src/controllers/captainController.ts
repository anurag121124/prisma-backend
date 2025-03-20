import { Request, Response, NextFunction } from 'express';
import { registerCaptain, loginCaptain } from '../services/captainService';
import { registerSchemaCaptain, loginSchema } from '../utils/validation';
import { AuthError } from '../utils/errors';
import { logger } from '../utils/logger';

export const registerCaptainController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = registerSchemaCaptain.parse(req.body);

    const { sanitizedCaptain, token } = await registerCaptain(validatedData);

    res.status(201).json({
      success: true,
      message: 'Captain registered successfully',
      data: sanitizedCaptain,
      token,
    });
  } catch (error) {
    logger.error('Error in registerCaptainController:', error); // Log error details
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};


export const loginCaptainController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body); // Validate input data
    const result = await loginCaptain(validatedData); // Pass validated login data to the service

    // Use res.json to send the response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });

  } catch (error) {
    if (error instanceof AuthError) {
      // Use res.status to send the error response
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return; // Ensure the function exits after sending the response
    }
    next(error); // Pass other errors to the error handler
  }
};
