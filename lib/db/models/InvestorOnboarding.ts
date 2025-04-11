import mongoose, { Schema, Document, models, Model, Types } from "mongoose";

export interface IInvestorOnboarding extends Document {
  userId: Types.ObjectId; // Reference to the main User document's _id
  clerkId: string; // Store Clerk ID for potential direct lookups
  investmentFocus?: string[]; // e.g., ['EdTech', 'FinTech']
  preferredStages?: string[]; // e.g., ['Seed', 'Series A']
  portfolioSize?: string; // e.g., '$100k-$500k', '$1M+'
  companyName?: string;
  roleInCompany?: string;
  riskAppetite?: "low" | "medium" | "high";
  linkedInProfile?: string;
  website?: string;
  accreditationStatus?: boolean;
  onboardingData: Record<string, any>; // Catch-all for other form data
  completedAt: Date;
}

const InvestorOnboardingSchema: Schema<IInvestorOnboarding> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clerkId: { type: String, required: true, index: true },
    investmentFocus: [{ type: String }],
    preferredStages: [{ type: String }],
    portfolioSize: { type: String },
    companyName: { type: String },
    roleInCompany: { type: String },
    riskAppetite: { type: String, enum: ["low", "medium", "high"] },
    linkedInProfile: { type: String },
    website: { type: String },
    accreditationStatus: { type: Boolean },
    onboardingData: { type: Schema.Types.Mixed }, // Flexible field for extra data
    completedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "completedAt", updatedAt: false }, // Only use completedAt
    collection: "investor-onboardings", // Explicit collection name
  }
);

const InvestorOnboarding: Model<IInvestorOnboarding> =
  models.InvestorOnboarding ||
  mongoose.model<IInvestorOnboarding>(
    "InvestorOnboarding",
    InvestorOnboardingSchema
  );

export default InvestorOnboarding;
