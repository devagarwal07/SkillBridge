import mongoose, { Schema, Document, models, Model } from "mongoose";

// Interface for the blockchain connection document
export interface IBlockchainConnection extends Document {
  studentProposalId: string; // ID of the student proposal (e.g., "student-001")
  blockchainProposalId: number; // ID of the blockchain proposal (e.g., 1)
  title: string; // Title of the blockchain proposal
  ethAmount: number; // Amount in ETH
  transactions: Array<{
    txHash: string;
    from: string;
    amount: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for BlockchainConnection
const BlockchainConnectionSchema: Schema<IBlockchainConnection> = new Schema(
  {
    studentProposalId: {
      type: String,
      required: true,
      unique: true,
    },
    blockchainProposalId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ethAmount: {
      type: Number,
      required: true,
    },
    transactions: [
      {
        txHash: { type: String, required: true },
        from: { type: String, required: true },
        amount: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    collection: "blockchain-connections",
  }
);

// Force delete the cached model in development
if (
  process.env.NODE_ENV === "development" &&
  mongoose.models.BlockchainConnection
) {
  delete mongoose.models.BlockchainConnection;
  console.log("Deleted cached BlockchainConnection model in development.");
}

const BlockchainConnection: Model<IBlockchainConnection> =
  models.BlockchainConnection ||
  mongoose.model<IBlockchainConnection>(
    "BlockchainConnection",
    BlockchainConnectionSchema
  );

export default BlockchainConnection;
