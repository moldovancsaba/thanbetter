import { sign, verify } from 'jsonwebtoken';
import Session, { ISession } from '../models/Session';
import SessionLog from '../models/SessionLog';
import { Types } from 'mongoose';

export class SessionService {
  private static readonly SESSION_EXPIRY = parseInt(process.env.SESSION_EXPIRY || '86400000', 10); // 24 hours
  private static readonly SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-change-this';

  /**
   * Creates a new session for a user
   */
  static async createSession(userId: string, metadata: { userAgent?: string; ip?: string } = {}) {
    const token = sign({ userId }, this.SESSION_SECRET, { expiresIn: this.SESSION_EXPIRY / 1000 });
    
    const expiresAt = new Date(Date.now() + this.SESSION_EXPIRY);
    
    const session = await Session.create({
      userId: new Types.ObjectId(userId),
      token,
      expiresAt,
      createdAt: new Date(),
      lastActive: new Date(),
      isActive: true
    });

    // Log the session creation
    await SessionLog.create({
      sessionId: session._id,
      userId: new Types.ObjectId(userId),
      eventType: 'LOGIN',
      timestamp: new Date(),
      metadata
    });

    return session;
  }

  /**
   * Validates a session token
   */
  static async validateSession(token: string): Promise<ISession | null> {
    try {
      // Verify the token
      verify(token, this.SESSION_SECRET);

      // Find the session
      const session = await Session.findOne({ token, isActive: true });

      if (!session || session.isExpired) {
        if (session) {
          await this.deactivateSession(session._id.toString(), 'EXPIRED');
        }
        return null;
      }

      // Update last active timestamp
      session.lastActive = new Date();
      await session.save();

      return session;
    } catch (error) {
      return null;
    }
  }

  /**
   * Deactivates a session
   */
  static async deactivateSession(sessionId: string, reason: 'LOGOUT' | 'EXPIRED', metadata: { userAgent?: string; ip?: string } = {}) {
    const session = await Session.findById(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    session.isActive = false;
    await session.save();

    // Log the session deactivation
    await SessionLog.create({
      sessionId: session._id,
      userId: session.userId,
      eventType: reason,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        reason: reason === 'EXPIRED' ? 'Session expired' : 'User logout'
      }
    });

    return session;
  }

  /**
   * Gets active sessions for a user
   */
  static async getActiveSessions(userId: string): Promise<ISession[]> {
    return Session.find({
      userId: new Types.ObjectId(userId),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
  }

  /**
   * Gets session logs for a user
   */
  static async getSessionLogs(userId: string, limit = 50) {
    return SessionLog.find({ userId: new Types.ObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('sessionId')
      .exec();
  }
}

