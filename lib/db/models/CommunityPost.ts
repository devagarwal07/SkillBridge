import mongoose, { Schema, Document } from "mongoose";

export interface ICommunityPost extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    likes: mongoose.Types.ObjectId[];
  }[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const CommunityPostSchema: Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.CommunityPost ||
  mongoose.model<ICommunityPost>("CommunityPost", CommunityPostSchema);
