import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { 
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    required: true
  },
  lastLoginAt: {
    type: Date,
    default: () => new Date(),
    required: true
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(_doc, ret) {
      delete ret.password;
      if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
      if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
      if (ret.lastLoginAt) ret.lastLoginAt = new Date(ret.lastLoginAt).toISOString();
      return ret;
    }
  }
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

