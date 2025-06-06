import { ObjectId } from 'mongodb';

// Extended user type that includes all required fields
export interface User {
  _id?: ObjectId;  // Optional since MongoDB will create it
  id?: string;     // String version of _id for NextAuth
  username: string; // Only username is required
  email?: string;
  password?: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  createdAt?: string;  // ISO 8601 format
  lastLoginAt?: string;  // ISO 8601 format
  updatedAt?: string;  // ISO 8601 format
}

// Type for responses (omits sensitive fields)
export type UserResponse = Omit<User, 'password'>;

// Input types for operations
export interface UserCreateInput {
  email?: string;
  password?: string;
  name?: string;
  username?: string;
}

export interface UserLoginInput {
  email?: string;
  password?: string;
  username?: string;
}

