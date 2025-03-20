import  {  JwtPayload } from 'jsonwebtoken';

export enum RideStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum CaptainStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  BUSY = "BUSY"
}

export enum VehicleType {
  CAR = "CAR",
  MOTORCYCLE = "MOTORCYCLE",
  AUTO = "AUTO",
}
// Initialize Prisma Client

// Types for the User model
export type User = {
  id?: string;
  email: string;
  fullName: string;
  socketId: string | null;
  password: string;
  mobile_number: string;
  firebaseId: string;
};

// Types for the Ride model
export type Ride = {
  id: string;
  userId: string;
  captainId: string | null;
  pickup: string;
  destination: string;
  fare: number;
  status: RideStatus;
  duration: number | null;  // in seconds
  distance: number | null;  // in kilometers
  paymentId: string | null;
  orderId: string | null;
  signature: string | null;
  otp: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  captain: Captain | null;
};

// Types for the Captain model
export type Captain = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
  socketId: string | null;
  status: CaptainStatus;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle | null;
  location: Location | null;
  rides: Ride[];
};

// Types for the Vehicle model
export type Vehicle = {
  id: string;
  color: string;
  plate: string;
  capacity: number;
  vehicleType: VehicleType;
  captainId: string;
  createdAt: Date;
  updatedAt: Date;
  captain: Captain;
};

// Types for the Location model
export type Location = {
  id: string;
  latitude: number;
  longitude: number;
  captainId: string;
  updatedAt: Date;
  captain: Captain;
};

// Types for the BlacklistToken model
export type BlacklistToken = {
  id: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
};




export type CreateCaptain = {
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
  status: CaptainStatus;
  vehicle?: {
    color: string;
    plate: string;
    capacity: number;
    vehicleType: VehicleType;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  socketId?: string | null;
};


export type LoginCaptain = {
  email: string;
  password: string;
};


export interface CustomRequest extends Request {
  token: string | JwtPayload;
}