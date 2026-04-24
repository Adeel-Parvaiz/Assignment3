import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'agent' | 'client';
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['admin', 'agent'],
        default: 'agent'
    },
},
// automatically add createdAt and updatedAt fields
    {
    timestamps: true,
    }
);

UserSchema.pre('save', async function (next) {
    // if password is not save, no need to hash
    if (!this.isModified('password')) {
        return next(); // go to next step and save in DB
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
// return old if already exist, otherwise create new
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);