import mongoose, { Schema, Document, models, Model } from "mongoose";

// Interface defining the structure of a Proposal document
export interface IProposal extends Document {
  userId?: Schema.Types.ObjectId; // Reference to the User who submitted the proposal - Made optional
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  fundingGoals: {
    amountRequested: number;
    purpose: string; // e.g., Tuition Fees, Living Expenses, Course Materials
    courseName: string;
    institutionName: string;
    studyDurationMonths?: number;
  };
  financialInfo?: {
    annualIncome?: number;
    hasCollateral?: boolean;
    creditScore?: number; // Could be fetched or calculated separately
  };
  essayOrStatement?: string; // Personal statement or essay
  supportingDocuments?: {
    documentType: string; // e.g., ID Proof, Admission Letter, Income Statement
    url: string; // URL to the uploaded document
  }[];
  status: "submitted" | "under_review" | "approved" | "rejected" | "withdrawn"; // Original statuses
  submittedAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Proposal
const ProposalSchema: Schema<IProposal> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // Was optional
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
    fundingGoals: {
      amountRequested: { type: Number, required: true },
      purpose: { type: String, required: true },
      courseName: { type: String, required: true },
      institutionName: { type: String, required: true },
      studyDurationMonths: { type: Number },
    },
    financialInfo: {
      annualIncome: { type: Number },
      hasCollateral: { type: Boolean },
      creditScore: { type: Number },
    },
    essayOrStatement: { type: String },
    supportingDocuments: [
      {
        documentType: { type: String },
        url: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected", "withdrawn"], // Original statuses
      default: "submitted",
    },
    // submittedAt and updatedAt handled by timestamps
  },
  {
    timestamps: { createdAt: "submittedAt", updatedAt: "updatedAt" },
    collection: "proposal-student",
  }
);

// Force delete the cached model in development
if (process.env.NODE_ENV === "development" && mongoose.models.Proposal) {
  delete mongoose.models.Proposal;
  console.log("Deleted cached Proposal model in development.");
}

const Proposal: Model<IProposal> =
  models.Proposal || mongoose.model<IProposal>("Proposal", ProposalSchema);

export default Proposal;
