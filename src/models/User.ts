import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  registrationTime: Date;
  lastActive: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  registrationTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastActive: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastActive timestamp on every operation
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

