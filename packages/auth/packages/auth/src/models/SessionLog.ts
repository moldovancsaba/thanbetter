import mongoose from 'mongoose';

export interface ISessionLog extends mongoose.Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  eventType: 'LOGIN' | 'LOGOUT' | 'EXPIRED';
  timestamp: Date;
  metadata: {
    userAgent?: string;
    ip?: string;
    reason?: string;
  };
}

const sessionLogSchema = new mongoose.Schema<ISessionLog>({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    enum: ['LOGIN', 'LOGOUT', 'EXPIRED'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  metadata: {
    userAgent: String,
    ip: String,
    reason: String
  }
});

// Indexes for querying logs
sessionLogSchema.index({ sessionId: 1 });
sessionLogSchema.index({ userId: 1 });
sessionLogSchema.index({ timestamp: -1 });

const SessionLog = mongoose.models.SessionLog || mongoose.model<ISessionLog>('SessionLog', sessionLogSchema);

export default SessionLog;

