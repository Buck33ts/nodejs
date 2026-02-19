import mongoose, { Document, Schema } from "mongoose";
import { nanoid } from "nanoid/non-secure";

export interface ISchool {
  _id: string;
  name: string;
  abbreviation: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    _id: { type: String, default: () => nanoid() },
    name: { type: String, required: true, unique: true },
    abbreviation: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, _id: false }
);

export default mongoose.model<ISchool>("School", schoolSchema);
