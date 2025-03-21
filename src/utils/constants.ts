export const AUTH_CONSTANTS = {
    JWT_EXPIRY: '1h',
    PASSWORD_MIN_LENGTH: 8,
    SALT_ROUNDS: 10,
    STATUS: {
      ACTIVE: 'ACTIVE',
      INACTIVE: 'INACTIVE',
      SUSPENDED: 'SUSPENDED'
    },
    VEHICLE_TYPES: {
      SEDAN: 'SEDAN',
      SUV: 'SUV',
      VAN: 'VAN'
    }
  } as const;