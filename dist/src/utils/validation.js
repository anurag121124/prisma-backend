"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchemaCaptain = exports.loginSchema = exports.registerSchema = exports.vehicleSchema = exports.locationSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("./constants");
const client_1 = require("@prisma/client");
exports.locationSchema = zod_1.z.object({
    latitude: zod_1.z.number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
    longitude: zod_1.z.number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
});
exports.vehicleSchema = zod_1.z.object({
    color: zod_1.z.string().min(2).max(50),
    plate: zod_1.z.string().min(2).max(20),
    capacity: zod_1.z.number().int().positive().max(50),
    vehicleType: zod_1.z.enum(Object.values(constants_1.AUTH_CONSTANTS.VEHICLE_TYPES))
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
    firstName: zod_1.z.string().min(2).max(50).trim(),
    lastName: zod_1.z.string().min(2).max(50).trim(),
    socketId: zod_1.z.string().optional(),
    password: zod_1.z.string().min(constants_1.AUTH_CONSTANTS.PASSWORD_MIN_LENGTH)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    location: exports.locationSchema.optional(),
    vehicle: exports.vehicleSchema.optional(),
    status: zod_1.z.enum(Object.values(constants_1.AUTH_CONSTANTS.STATUS))
        .default(constants_1.AUTH_CONSTANTS.STATUS.INACTIVE)
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.registerSchemaCaptain = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().nullable(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    status: zod_1.z.nativeEnum(client_1.CaptainStatus), // Validate against the enum
    vehicle: zod_1.z
        .object({
        color: zod_1.z.string(),
        plate: zod_1.z.string(),
        capacity: zod_1.z.number().int(),
        vehicleType: zod_1.z.nativeEnum(client_1.VehicleType)
    })
        .optional(),
    location: zod_1.z
        .object({
        latitude: zod_1.z.number(),
        longitude: zod_1.z.number()
    })
        .optional(),
    socketId: zod_1.z.string().nullable().optional()
});
