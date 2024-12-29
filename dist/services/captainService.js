"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCaptain = exports.registerCaptain = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const passwordUtils_1 = require("../utils/passwordUtils");
const constants_1 = require("../utils/constants");
const logger_1 = require("../utils/logger");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
// Register a new captain
const registerCaptain = async (captain) => {
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
                throw new errors_1.AuthError('Email already registered', 409);
            }
            // Check if the vehicle plate is already registered
            if (vehicle?.plate) {
                const existingVehicle = await tx.vehicle.findFirst({
                    where: {
                        plate: vehicle.plate.toUpperCase(),
                    },
                });
                if (existingVehicle) {
                    throw new errors_1.AuthError(`Vehicle with plate ${vehicle.plate} already exists`, 409);
                }
            }
            const existingSocketId = await tx.captain.findFirst({
                where: { socketId },
            });
            if (existingSocketId) {
                throw new errors_1.AuthError('Socket ID is already in use', 409);
            }
            // Hash the password
            const hashedPassword = await (0, passwordUtils_1.hashPassword)(password);
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
            const token = jsonwebtoken_1.default.sign({ id: newCaptain.id, email: newCaptain.email }, JWT_SECRET, { expiresIn: constants_1.AUTH_CONSTANTS.JWT_EXPIRY });
            // Sanitize the response to remove sensitive data
            const { password: _, ...sanitizedCaptain } = newCaptain;
            logger_1.logger.info(`New registration attempt for email: ${email}`);
            return { sanitizedCaptain, token };
        });
    }
    catch (error) {
        logger_1.logger.error('Error in registerCaptain:', error);
        // Handle Prisma unique constraint errors specifically
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            const target = error.meta?.target;
            if (target && target.includes('plate')) {
                throw new errors_1.AuthError(`Vehicle with plate already exists`, 409);
            }
            if (target && target.includes('email')) {
                throw new errors_1.AuthError(`Email already registered`, 409);
            }
        }
        // Re-throw AuthErrors or return a generic failure message
        if (error instanceof errors_1.AuthError) {
            throw error;
        }
        throw new errors_1.AuthError('Registration failed. Please try again later.', 500);
    }
};
exports.registerCaptain = registerCaptain;
// Login a captain
const loginCaptain = async (captain) => {
    const { email, password } = captain;
    try {
        const existingCaptain = await prisma.captain.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                location: true,
                vehicle: true
            }
        });
        if (!existingCaptain) {
            throw new errors_1.AuthError('Invalid credentials', 401);
        }
        const isPasswordValid = await (0, passwordUtils_1.comparePasswords)(password, existingCaptain.password);
        if (!isPasswordValid) {
            throw new errors_1.AuthError('Invalid credentials', 401);
        }
        if (existingCaptain.status === constants_1.AUTH_CONSTANTS.STATUS.SUSPENDED) {
            throw new errors_1.AuthError('Captain is inactive', 403);
        }
        const { password: _, ...sanitizedCaptain } = existingCaptain;
        const token = jsonwebtoken_1.default.sign({ id: existingCaptain.id, email: existingCaptain.email }, JWT_SECRET, { expiresIn: constants_1.AUTH_CONSTANTS.JWT_EXPIRY });
        return {
            captain: sanitizedCaptain,
            token
        };
    }
    catch (error) {
        if (error instanceof errors_1.AuthError) {
            throw error;
        }
        throw new errors_1.AuthError('Login failed. Please try again later.', 500);
    }
};
exports.loginCaptain = loginCaptain;
