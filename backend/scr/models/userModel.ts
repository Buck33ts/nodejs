import mongoose, { Document, Schema } from "mongoose";
import { nanoid } from "nanoid/non-secure";
import bcrypt from "bcryptjs";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'main_counselor' | 'school_counselor' | 'teacher' | 'student';
  anxietyLevel?: number;
  preferences?: {
    reminderSettings: boolean;
    therapyTypes: string[];
  };
  schoolId?: string;
  programId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: () => nanoid() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'main_counselor', 'school_counselor', 'teacher', 'student'], default: 'student' },
    anxietyLevel: { type: Number, min: 1, max: 10 },
    preferences: {
      reminderSettings: { type: Boolean, default: true },
      therapyTypes: [{ type: String }]
    },
    schoolId: { type: String, ref: 'School' },
    programId: { type: String, ref: 'Program' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, _id: false }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);