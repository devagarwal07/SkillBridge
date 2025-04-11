import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IInvestor extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  investmentCapacity: number;
  investmentsMade: number;
  totalFundedAmount: number;
  successRate: number;
  interestAreas: string[];
  minimumCreditScore: number;
  biography: string;
}

const InvestorSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    investmentCapacity: { type: Number, default: 0 },
    investmentsMade: { type: Number, default: 0 },
    totalFundedAmount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    interestAreas: [String],
    minimumCreditScore: { type: Number, default: 600 },
    biography: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Investor ||
  mongoose.model<IInvestor>("Investor", InvestorSchema);
