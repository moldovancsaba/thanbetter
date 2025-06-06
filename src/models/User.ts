import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  createdAt: string;  // ISO 8601 string
  lastLogin: string;  // ISO 8601 string
  updatedAt?: string;  // ISO 8601 string
}

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true,
    minlength: [2, 'Username must be at least 2 characters long']
  },
  createdAt: {
    type: String,
    required: true
  },
  lastLogin: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String
  }
}, {
  toJSON: { 
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
