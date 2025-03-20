import { Request, Response, NextFunction } from 'express';
import {
    acceptRide,
    declineRide,
    startRide,
    completeRide,
    requestRide,
    getRideDetails,
    cancelRide,
    retryRide,
    getRideStatus,
    updateRideStatus,
} from '../services/rideService'; // Import service functions
import { logger } from '../utils/logger';
import { AuthError } from '../utils/errors';

// ======================
// Ride Actions (Driver Actions)
// ======================

/**
 * Driver accepts a ride request
 * POST /rides/accept/{rideId}
 */
export const acceptRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;
        const { captainId } = req.body;

        if (!rideId || !captainId) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await acceptRide(rideId, captainId);

        res.status(200).json({
            success: true,
            message: 'Ride accepted successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in acceptRideController:', error);
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

/**
 * Driver declines a ride request
 * POST /rides/decline/{rideId}
 */
export const declineRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;
        const { captainId } = req.body;

        if (!rideId || !captainId) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await declineRide(rideId, captainId);

        res.status(200).json({
            success: true,
            message: 'Ride declined successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in declineRideController:', error);
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

/**
 * Driver starts a ride
 * POST /rides/start/{rideId}
 */
export const startRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;
        const { captainId } = req.body;

        if (!rideId || !captainId) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await startRide(rideId, captainId);

        res.status(200).json({
            success: true,
            message: 'Ride started successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in startRideController:', error);
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

/**
 * Driver completes a ride
 * POST /rides/complete/{rideId}
 */
export const completeRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;
        const { captainId } = req.body;

        if (!rideId || !captainId) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await completeRide(rideId, captainId);

        res.status(200).json({
            success: true,
            message: 'Ride completed successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in completeRideController:', error);
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

// ======================
// Ride Requests
// ======================

/**
 * Request a ride (rider inputs pickup, drop, and preferences)
 * POST /rides/request
 */
export const requestRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId, pickup, destination, fare } = req.body;

        if (!userId || !pickup || !destination || !fare) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await requestRide(userId, pickup, destination, fare);

        res.status(201).json({
            success: true,
            message: 'Ride requested successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in requestRideController:', error);
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

/**
 * Fetch ride details
 * GET /rides/{rideId}
 */
export const getRideDetailsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;

        if (!rideId) {
            throw new AuthError('Missing rideId', 400);
        }

        const ride = await getRideDetails(rideId);

        res.status(200).json({
            success: true,
            message: 'Ride details fetched successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in getRideDetailsController:', error);
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

/**
 * Cancel a ride request
 * POST /rides/cancel/{rideId}
 */
export const cancelRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;
        const { userId } = req.body;

        if (!rideId || !userId) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await cancelRide(rideId, userId);

        res.status(200).json({
            success: true,
            message: 'Ride cancelled successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in cancelRideController:', error);
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

/**
 * Retry finding a driver
 * POST /rides/retry/{rideId}
 */
export const retryRideController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;

        if (!rideId) {
            throw new AuthError('Missing rideId', 400);
        }

        const ride = await retryRide(rideId);

        res.status(200).json({
            success: true,
            message: 'Ride retry initiated successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in retryRideController:', error);
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

// ======================
// Ride Status
// ======================

/**
 * Get real-time ride status
 * GET /rides/status/{rideId}
 */
export const getRideStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;

        if (!rideId) {
            throw new AuthError('Missing rideId', 400);
        }

        const status = await getRideStatus(rideId);

        res.status(200).json({
            success: true,
            message: 'Ride status fetched successfully',
            data: { status },
        });
    } catch (error) {
        logger.error('Error in getRideStatusController:', error);
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

/**
 * Update ride status (driver starts, completes, cancels)
 * POST /rides/update/{rideId}
 */
export const updateRideStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { rideId } = req.params;
        const { status } = req.body;

        if (!rideId || !status) {
            throw new AuthError('Missing required fields', 400);
        }

        const ride = await updateRideStatus(rideId, status);

        res.status(200).json({
            success: true,
            message: 'Ride status updated successfully',
            data: ride,
        });
    } catch (error) {
        logger.error('Error in updateRideStatusController:', error);
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