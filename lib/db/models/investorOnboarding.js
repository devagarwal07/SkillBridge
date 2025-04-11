import mongoose from "mongoose";

const InvestorOnboardingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  investmentFocus: {
    type: [String],
    required: true,
  },
  investmentStage: {
    type: String,
    required: true,
  },
  portfolioSize: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InvestorOnboarding =
  mongoose.models.InvestorOnboarding ||
  mongoose.model(
    "InvestorOnboarding",
    InvestorOnboardingSchema,
    "investor-onboarding"
  );

export default InvestorOnboarding;
