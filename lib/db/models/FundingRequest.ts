import mongoose, { Schema, Document, models } from "mongoose";

// Define interfaces for nested objects
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface Education {
  currentLevel: string;
  institution: string;
  major: string;
  graduationDate: string; // Consider using Date type if precise date is needed
  skills: string[];
}

interface Funding {
  amount: number;
  timeline: string;
  preferredModel: string; // e.g., ISA, Loan
  purpose: string;
}

interface Career {
  shortTermGoals: string;
  longTermGoals: string;
  targetIndustries: string[];
  targetRoles: string[];
  salaryExpectations: number;
}

interface Documents {
  resume: string; // Store filename or URL
  transcript: string; // Store filename or URL
  portfolioLink?: string;
  additionalLinks: string[];
}

// Define the main document interface
export interface IFundingRequest extends Document {
  userId: Schema.Types.ObjectId; // Link to the user submitting the request
  personalInfo: PersonalInfo;
  education: Education;
  funding: Funding;
  career: Career;
  documents: Documents;
  status: "pending" | "approved" | "rejected" | "under_review";
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const FundingRequestSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
    },
    education: {
      currentLevel: { type: String, required: true },
      institution: { type: String, required: true },
      major: { type: String, required: true },
      graduationDate: { type: String, required: true }, // Or Date
      skills: [{ type: String }],
    },
    funding: {
      amount: { type: Number, required: true },
      timeline: { type: String, required: true },
      preferredModel: { type: String, required: true },
      purpose: { type: String, required: true },
    },
    career: {
      shortTermGoals: { type: String, required: true },
      longTermGoals: { type: String, required: true },
      targetIndustries: [{ type: String }],
      targetRoles: [{ type: String }],
      salaryExpectations: { type: Number, required: true },
    },
    documents: {
      resume: { type: String }, // Store filename or URL
      transcript: { type: String }, // Store filename or URL
      portfolioLink: { type: String },
      additionalLinks: [{ type: String }],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "under_review"],
      default: "pending",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Create and export the model
const FundingRequest =
  models.FundingRequest ||
  mongoose.model<IFundingRequest>("FundingRequest", FundingRequestSchema);

export default FundingRequest;
