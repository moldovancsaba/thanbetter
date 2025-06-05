import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  email?: string;
  createdAt: string;  // ISO 8601 string
  updatedAt: string;  // ISO 8601 string
  lastLoginAt?: string;  // ISO 8601 string
}

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    sparse: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    get: (v: Date) => v.toISOString()
  },
  lastLoginAt: {
    type: Date,
    default: null,
    get: (v: Date | null) => v ? v.toISOString() : null
  }
}, {
  timestamps: true,
  toJSON: { 
    getters: true,
    transform: (doc, ret) => {
      // Ensure timestamps are in ISO 8601 format
      if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
      if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
      if (ret.lastLoginAt) ret.lastLoginAt = new Date(ret.lastLoginAt).toISOString();
      return ret;
    }
  }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
