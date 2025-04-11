import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface ISkill {
  name: string;
  level: number; // 1-100
  isVerified: boolean;
  verificationId?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  isCurrently: boolean;
  gpa?: number;
}

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  educationCredit: number; // 1-1000 score
  skills: ISkill[];
  education: IEducation[];
  certifications: {
    name: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate?: Date;
    verificationId?: string;
  }[];
  careerGoals: string[];
  achievements: string[];
}

const SkillSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 1, max: 100, required: true },
  isVerified: { type: Boolean, default: false },
  verificationId: String,
});

const EducationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrently: { type: Boolean, default: false },
  gpa: Number,
});

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuedBy: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  expiryDate: Date,
  verificationId: String,
});

const StudentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    educationCredit: { type: Number, min: 1, max: 1000, default: 500 },
    skills: [SkillSchema],
    education: [EducationSchema],
    certifications: [CertificationSchema],
    careerGoals: [String],
    achievements: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model<IStudent>("Student", StudentSchema);
