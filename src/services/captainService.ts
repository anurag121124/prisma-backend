import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { CreateCaptain, LoginCaptain } from '../types/types';
import { AuthError } from '../utils/errors';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { AUTH_CONSTANTS } from '../utils/constants';
import { logger } from '../utils/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Register a new captain
export const registerCaptain = async (captain: CreateCaptain) => {
  const { email, firstName, lastName, socketId, password, location, vehicle, status } = captain;

  try {
    return await prisma.$transaction(async (tx) => {
      // Check if the email is already registered
      const existingCaptain = await tx.captain.findFirst({
        where: {
          email: { equals: email.toLowerCase(), mode: 'insensitive' },
        },
      });

      if (existingCaptain) {
        throw new AuthError('Email already registered', 409);
      }

      // Check if the vehicle plate is already registered
      if (vehicle?.plate) {
        const existingVehicle = await tx.vehicle.findFirst({
          where: {
            plate: vehicle.plate.toUpperCase(),
          },
        });

        if (existingVehicle) {
          throw new AuthError(`Vehicle with plate ${vehicle.plate} already exists`, 409);
        }
      }

      const existingSocketId = await tx.captain.findFirst({
        where: { socketId },
      });

      if (existingSocketId) {
        throw new AuthError('Socket ID is already in use', 409);
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create the captain and related entities
      const newCaptain = await tx.captain.create({
        data: {
          email: email.toLowerCase(),
          firstName,
          lastName,
          socketId,
          password: hashedPassword,
          status,
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

      // Generate a JWT token
      const token = jwt.sign(
        { id: newCaptain.id, email: newCaptain.email },
        JWT_SECRET,
        { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
      );

      // Exclude password before returning the response
      const { password: _password, ...sanitizedCaptain } = newCaptain;
      logger.info(`New registration attempt for email: ${email}`);
      return { sanitizedCaptain, token };
    });
  } catch (error) {
    logger.error('Error in registerCaptain:', error);

    // Handle Prisma unique constraint errors specifically
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target as string[] | undefined;

      if (target?.includes('plate')) {
        throw new AuthError('Vehicle with plate already exists', 409);
      }

      if (target?.includes('email')) {
        throw new AuthError('Email already registered', 409);
      }
    }

    // Re-throw AuthErrors or return a generic failure message
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError('Registration failed. Please try again later.', 500);
  }
};

// Login a captain
export const loginCaptain = async (captain: LoginCaptain) => {
  const { email, password } = captain;

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

    const isPasswordValid = await comparePasswords(
      password,
      existingCaptain.password
    );

    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials', 401);
    }

    if (existingCaptain.status === AUTH_CONSTANTS.STATUS.SUSPENDED) {
      throw new AuthError('Captain is inactive', 403);
    }

    // Exclude password before returning the response
    const { password: _password, ...sanitizedCaptain } = existingCaptain;

    const token = jwt.sign(
      { id: existingCaptain.id, email: existingCaptain.email },
      JWT_SECRET,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
    );

    return {
      captain: sanitizedCaptain,
      token,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Login failed. Please try again later.', 500);
  }
};
