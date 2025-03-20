import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/errors';
import { logger } from '../utils/logger';
import { RideStatus } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

const prisma = new PrismaClient();

// ======================
// Ride Actions (Driver Actions)
// ======================

/**
 * Driver accepts a ride request
 * POST /rides/accept/{rideId}
 */
export const acceptRide = async (rideId: string, captainId: string) => {
    try {
        // Check if the ride exists and is in PENDING status
        const ride = await prisma.ride.findUnique({
            where: { id: rideId, status: 'PENDING' },
        });

        if (!ride) {
            throw new AuthError('Ride not found', 404);
        }

        // Check if the captain exists
        const captain = await prisma.captain.findUnique({
            where: { id: captainId },
        });

        if (!captain) {
            throw new AuthError('Captain not found', 404);
        }

        // Update the ride status to ACCEPTED
        const updatedRide = await prisma.ride.update({
            where: { id: rideId },
            data: { status: 'ACCEPTED', captainId },
        });

        return updatedRide;
    } catch (error) {
        logger.error(`Error accepting ride: ${error}`);
        throw new AuthError('Unable to accept ride');
    }
};

/**
 * Driver declines a ride request
 * POST /rides/decline/{rideId}
 */
export const declineRide = async (rideId: string, captainId: string) => {
    try {
        const ride = await prisma.ride.update({
            where: { id: rideId, status: 'PENDING' },
            data: { status: 'CANCELLED', captainId },
        });
        return ride;
    } catch (error) {
        logger.error(`Error declining ride: ${error}`);
        throw new AuthError('Unable to decline ride');
    }
};

/**
 * Driver starts a ride
 * POST /rides/start/{rideId}
 */
export const startRide = async (rideId: string, captainId: string) => {
    try {
        const ride = await prisma.ride.update({
            where: { id: rideId, captainId, status: 'ACCEPTED' },
            data: { status: 'ONGOING' },
        });
        return ride;
    } catch (error) {
        logger.error(`Error starting ride: ${error}`);
        throw new AuthError('Unable to start ride');
    }
};

/**
 * Driver completes a ride
 * POST /rides/complete/{rideId}
 */
export const completeRide = async (rideId: string, captainId: string) => {
    try {
        const ride = await prisma.ride.update({
            where: { id: rideId, captainId, status: 'ONGOING' },
            data: { status: 'COMPLETED' },
        });
        return ride;
    } catch (error) {
        logger.error(`Error completing ride: ${error}`);
        throw new AuthError('Unable to complete ride');
    }
};

// ======================
// Ride Requests
// ======================

/**
 * Request a ride (rider inputs pickup, drop, and preferences)
 * POST /rides/request
 */
export const requestRide = async (
    userId: string,
    pickup: string,
    destination: string,
    fare: number
) => {
    try {
        const ride = await prisma.ride.create({
            data: {
                userId,
                pickup,
                destination,
                fare,
                status: 'PENDING',
                otp: Math.floor(1000 + Math.random() * 9000).toString(), // Generate a 4-digit OTP
            },
        });
        return ride;
    } catch (error) {
        logger.error(`Error requesting ride: ${error}`);
        throw new AuthError('Unable to request ride');
    }
};

/**
 * Fetch ride details
 * GET /rides/{rideId}
 */
export const getRideDetails = async (rideId: string) => {
    try {
        const ride = await prisma.ride.findUnique({
            where: { id: rideId },
        });
        return ride;
    } catch (error) {
        logger.error(`Error fetching ride details: ${error}`);
        throw new AuthError('Unable to fetch ride details');
    }
};

/**
 * Cancel a ride request
 * POST /rides/cancel/{rideId}
 */
export const cancelRide = async (rideId: string, userId: string) => {
    try {
        const ride = await prisma.ride.update({
            where: { id: rideId, userId, status: 'PENDING' },
            data: { status: 'CANCELLED' },
        });
        return ride;
    } catch (error) {
        logger.error(`Error cancelling ride: ${error}`);
        throw new AuthError('Unable to cancel ride');
    }
};

/**
 * Retry finding a driver
 * POST /rides/retry/{rideId}
 */
export const retryRide = async (rideId: string) => {
    try {
        const ride = await prisma.ride.update({
            where: { id: rideId, status: 'CANCELLED' },
            data: { status: 'PENDING', captainId: null },
        });
        return ride;
    } catch (error) {
        logger.error(`Error retrying ride: ${error}`);
        throw new AuthError('Unable to retry ride');
    }
};

// ======================
// Ride Status
// ======================

/**
 * Get real-time ride status
 * GET /rides/status/{rideId}
 */
export const getRideStatus = async (rideId: string) => {
    try {
        const ride = await prisma.ride.findUnique({
            where: { id: rideId },
            select: { status: true },
        });
        return ride?.status;
    } catch (error) {
        logger.error(`Error fetching ride status: ${error}`);
        throw new AuthError('Unable to fetch ride status');
    }
};

/**
 * Update ride status (driver starts, completes, cancels)
 * POST /rides/update/{rideId}
 */
export const updateRideStatus = async (rideId: string, status: string) => {
    try {
        const ride = await prisma.ride.update({
            where: { id: rideId },
            data: { status: status as RideStatus },
        });
        return ride;
    } catch (error) {
        logger.error(`Error updating ride status: ${error}`);
        throw new AuthError('Unable to update ride status');
    }
};

// ======================
// Helper Functions
// ======================

/**
 * Verify JWT token
 */
export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        logger.error(`Error verifying token: ${error}`);
        throw new AuthError('Invalid token');
    }
};