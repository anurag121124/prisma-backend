import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { CreateCaptain, LoginCaptain } from '../types/types';
import { AuthError } from '../utils/errors';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { AUTH_CONSTANTS } from '../utils/constants';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export const registerCaptain = async (captain: CreateCaptain) => {
  const { email, firstName, lastName, socketId, password, location, vehicle } = captain;

  // Validate required fields
  if (!email || !firstName || !lastName || !password) {
    throw new AuthError('Missing required fields', 400);
  }

  try {
    // Ensure email uniqueness
    const existingCaptain = await prisma.captain.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingCaptain) {
      throw new AuthError('Email is already in use', 409);
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AuthError('Password must be at least 8 characters long', 400);
    }

    const hashedPassword = await hashPassword(password);

    return await prisma.$transaction(
      async (tx) => {
        const newCaptain = await tx.captain.create({
          data: {
            email: email.toLowerCase(),
            firstName,
            lastName,
            socketId,
            password: hashedPassword,
            status: 'INACTIVE', // Default status
            location: location
              ? {
                  create: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                }
              : undefined,
            vehicle: vehicle
              ? {
                  create: {
                    color: vehicle.color,
                    plate: vehicle.plate.toUpperCase(),
                    capacity: vehicle.capacity,
                    vehicleType: vehicle.vehicleType,
                  },
                }
              : undefined,
          },
          include: {
            location: true,
            vehicle: true,
          },
        });

        const token = jwt.sign(
          { id: newCaptain.id, email: newCaptain.email },
          JWT_SECRET,
          { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
        );

        const { password: _password, ...sanitizedCaptain } = newCaptain;
        logger.info(`New captain registered: ${email}`);

        return { sanitizedCaptain, token };
      },
      { timeout: 10000 }
    );
  } catch (error) {
    logger.error('Error in registerCaptain:', error);

    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      throw new AuthError('Email already exists', 409);
    }

    throw new AuthError('Registration failed. Please try again later.', 500);
  }
};

export const loginCaptain = async (captain: LoginCaptain) => {
  const { email, password } = captain;

  // Validate required fields
  if (!email || !password) {
    throw new AuthError('Email and password are required', 400);
  }

  try {
    const existingCaptain = await prisma.captain.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        location: true,
        vehicle: true,
      },
    });

    if (!existingCaptain) {
      throw new AuthError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePasswords(password, existingCaptain.password);

    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials', 401);
    }

    if (existingCaptain.status === AUTH_CONSTANTS.STATUS.SUSPENDED) {
      throw new AuthError('Captain is suspended', 403);
    }

    if (existingCaptain.is_active === false ) {
      throw new AuthError('Captain account is not activated', 403);
    }

    const { password: _password, id, status, is_active } = existingCaptain;

    const token = jwt.sign(
      { id: existingCaptain.id, email: existingCaptain.email },
      JWT_SECRET,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
    );

    return {
      captain: {
        id,
        email,
        socketId: existingCaptain.socketId,
        status,
        is_active,
      },
      token,
    };
  } catch (error) {
    logger.error('Error in loginCaptain:', error);

    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError('Login failed. Please try again later.', 500);
  }
};
