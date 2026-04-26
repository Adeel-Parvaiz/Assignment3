import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email:     string;
  password:  string;
  name:      string;
  role:      'admin' | 'agent';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type:    String,
      enum:    ['admin', 'agent'],
      default: 'agent',
    },
  },
  { timestamps: true }
);

// Hash password before saving to database
UserSchema.pre('save', async function () {
  // If password is not modified, skip hashing
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password as string, 12);
});

// Return existing model or create new one
export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);