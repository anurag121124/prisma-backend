import bcrypt from 'bcryptjs';
import { User } from '../types/types';
import { AUTH_CONSTANTS } from './constants';

  
  export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, AUTH_CONSTANTS.SALT_ROUNDS);
  };
  
  export const comparePasswords = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  };
  