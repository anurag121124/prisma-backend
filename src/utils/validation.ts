import { z } from 'zod';
import { AUTH_CONSTANTS } from './constants';
import { CaptainStatus, VehicleType } from '../types/types';
export const locationSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
});

export const vehicleSchema = z.object({
  color: z.string().min(2).max(50),
  plate: z.string().min(2).max(20),
  capacity: z.number().int().positive().max(50),
  vehicleType: z.enum(Object.values(AUTH_CONSTANTS.VEHICLE_TYPES) as [string, ...string[]])
});

export const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  firstName: z.string().min(2).max(50).trim(),
  lastName: z.string().min(2).max(50).trim(),
  socketId: z.string().optional(),
  password: z.string().min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  location: locationSchema.optional(),
  vehicle: vehicleSchema.optional(),
  status: z.enum(Object.values(AUTH_CONSTANTS.STATUS) as [string, ...string[]])
    .default(AUTH_CONSTANTS.STATUS.INACTIVE)
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});


export const registerSchemaCaptain = z.object({
  firstName: z.string().min(1),
  lastName: z.string().nullable(),
  email: z.string().email(),
  password: z.string().min(6),
  status: z.nativeEnum(CaptainStatus), // Validate against the enum
  vehicle: z
    .object({
      color: z.string(),
      plate: z.string(),
      capacity: z.number().int(),
      vehicleType: z.nativeEnum(VehicleType)
    })
    .optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number()
    })
    .optional(),
  socketId: z.string().nullable().optional()
});
