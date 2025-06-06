import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/User';
import { UserCreateInput, UserLoginInput } from '../types/user';
import mongoose from 'mongoose';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(input: UserCreateInput): Promise<IUser> {
    const User = mongoose.model<IUser>('User');

    // Check if user already exists
    const existingUser = await User.findOne({ username: input.username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({
      username: input.username,
      email: input.email,
    });

    await user.save();
    return user;
  }

  async validateUser(input: UserLoginInput): Promise<IUser> {
    const User = mongoose.model<IUser>('User');

    const user = await User.findOne({ username: input.username });
    if (!user) {
      throw new Error('User not found');
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    return user;
  }

  async getUserById(id: ObjectId): Promise<IUser | null> {
    const User = mongoose.model<IUser>('User');
    return User.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const User = mongoose.model<IUser>('User');
    return User.findOne({ email });
  }
}

