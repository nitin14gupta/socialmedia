import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: 0,
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: 0,
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 