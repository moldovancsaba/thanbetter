import connectToDatabase from '../lib/mongodb';
import Session from '../models/Session';
import { SessionService } from '../services/sessionService';

async function cleanupExpiredSessions() {
  try {
    await connectToDatabase();

    const now = new Date();
    const expiredSessions = await Session.find({
      isActive: true,
      expiresAt: { $lt: now }
    });

    console.log(`Found ${expiredSessions.length} expired sessions to clean up`);

    for (const session of expiredSessions) {
      await SessionService.deactivateSession(session._id.toString(), 'EXPIRED', {
        reason: 'Automatic cleanup of expired session'
      });
    }

    console.log('Session cleanup completed successfully');
  } catch (error) {
    console.error('Session cleanup error:', error);
  } finally {
    // Disconnect from database
    const mongoose = (await import('mongoose')).default;
    await mongoose.disconnect();
  }
}

// Run the cleanup
cleanupExpiredSessions();

