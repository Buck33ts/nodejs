import mongoose, { Document, Schema } from "mongoose";
import { nanoid } from "nanoid/non-secure";

export interface IProgram {
  _id: string;
  name: string;
  schoolId: string;
  description?: string;
  duration?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const programSchema = new Schema<IProgram>(
  {
    _id: { type: String, default: () => nanoid() },
    name: { type: String, required: true },
    schoolId: { type: String, required: true, ref: 'School' },
    description: { type: String },
    duration: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, _id: false }
);

// Index for efficient queries
programSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default mongoose.model<IProgram>("Program", programSchema);
