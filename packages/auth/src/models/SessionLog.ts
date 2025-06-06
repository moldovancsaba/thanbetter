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
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      if (ret.timestamp) ret.timestamp = new Date(ret.timestamp).toISOString();
      if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
      if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
      return ret;
    }
  }
});

// Indexes for querying logs
sessionLogSchema.index({ sessionId: 1 });
sessionLogSchema.index({ userId: 1 });
sessionLogSchema.index({ timestamp: -1 });

const SessionLog = mongoose.models.SessionLog || mongoose.model<ISessionLog>('SessionLog', sessionLogSchema);

export default SessionLog;

