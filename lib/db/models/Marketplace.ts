import mongoose, { Schema, Document } from "mongoose";

export interface IMarketplace extends Document {
  id: string;
  type: string;
  title: string;
  provider: string;
  courseId: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  skills: string[];
}

const MarketplaceSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    provider: { type: String, required: true },
    courseId: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    featured: { type: Boolean, required: true },
    skills: [{ type: String }],
  },
  { collection: "marketplace_items" } // Explicitly set the collection name
);

export default mongoose.models.Marketplace ||
  mongoose.model<IMarketplace>("Marketplace", MarketplaceSchema);
