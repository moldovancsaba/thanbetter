import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { User, UserCreateInput, UserLoginInput } from '../types/user';

const userSchema = new mongoose.Schema<User>({
  username: { 
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    sparse: true
  },
  createdAt: { 
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  updatedAt: { 
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  lastLoginAt: { 
    type: String,
    default: null
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(input: UserCreateInput): Promise<User> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ username: input.username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new UserModel({
      username: input.username,
      email: input.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await user.save();
    return user;
  }

  async validateUser(input: UserLoginInput): Promise<User> {
    const user = await UserModel.findOne({ username: input.username });
    if (!user) {
      throw new Error('User not found');
    }

    // Update last login time
    user.lastLoginAt = new Date().toISOString();
    await user.save();

    return user;
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    return UserModel.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email });
  }
}

