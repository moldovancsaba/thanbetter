import mongoose from 'mongoose';

export interface ISession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  appId: string;
  createdAt: Date;
  expiresAt: Date;
  lastActive: Date;
  isActive: boolean;
}

const sessionSchema = new mongoose.Schema<ISession>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  appId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  lastActive: {
    type: Date,
    required: true,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
      if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
      if (ret.lastActive) ret.lastActive = new Date(ret.lastActive).toISOString();
      if (ret.expiresAt) ret.expiresAt = new Date(ret.expiresAt).toISOString();
      return ret;
    }
  }
});

// Update lastActive timestamp on every operation
sessionSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Virtual for checking if session is expired
sessionSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Index for token lookups and expiry checks
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ userId: 1 });

const Session = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);

export default Session;

