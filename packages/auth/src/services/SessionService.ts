import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ISession } from '../models/Session';
import { IUser } from '../models/User';

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

  async createSession(user: IUser, appId: string): Promise<ISession> {
    const Session = mongoose.model<ISession>('Session');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const token = jwt.sign(
      { 
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        appId 
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    const session = new Session({
      userId: user._id,
      token,
      appId,
      createdAt: now,
      expiresAt,
      lastActive: now,
      isActive: true
    });

    await session.save();
    return session;
  }

  async validateSession(token: string): Promise<ISession | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; appId: string };
      
      const Session = mongoose.model<ISession>('Session');
      const session = await Session.findOne({
        userId: new ObjectId(decoded.userId),
        appId: decoded.appId,
        token,
        expiresAt: { $gt: new Date() },
        isActive: true
      });

      if (session) {
        session.lastActive = new Date();
        await session.save();
      }

      return session;
    } catch (error) {
      return null;
    }
  }

  async invalidateSession(token: string): Promise<void> {
    const Session = mongoose.model<ISession>('Session');
    await Session.updateOne(
      { token },
      { $set: { isActive: false } }
    );
  }

  async invalidateAllUserSessions(userId: ObjectId): Promise<void> {
    const Session = mongoose.model<ISession>('Session');
    await Session.updateMany(
      { userId },
      { $set: { isActive: false } }
    );
  }
}

