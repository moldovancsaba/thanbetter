import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../types/user';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

interface ISession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  appId: string;
  createdAt: string;  // ISO 8601 string
  expiresAt: string;  // ISO 8601 string
}

const sessionSchema = new mongoose.Schema<ISession>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  token: { 
    type: String,
    required: true,
    unique: true
  },
  appId: { 
    type: String,
    required: true 
  },
  createdAt: { 
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  expiresAt: { 
    type: String,
    required: true 
  }
});

const SessionModel = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);

export class SessionService {
  private static instance: SessionService;
  private jwtSecret: string;

  private constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async createSession(user: User, appId: string): Promise<ISession> {
    if (!user._id) {
      throw new Error('User ID is required');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        appId 
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    const session = new SessionModel({
      userId: new ObjectId(user._id),
      token,
      appId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    });

    await session.save();
    return session;
  }

  async validateSession(token: string): Promise<ISession | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; appId: string };

      const session = await SessionModel.findOne({
        userId: new ObjectId(decoded.userId),
        appId: decoded.appId,
        token,
        expiresAt: { $gt: new Date().toISOString() }
      });

      return session;
    } catch (error) {
      return null;
    }
  }

  async invalidateSession(token: string): Promise<void> {
    await SessionModel.deleteOne({ token });
  }

  async invalidateAllUserSessions(userId: ObjectId): Promise<void> {
    await SessionModel.deleteMany({ userId });
  }
}

