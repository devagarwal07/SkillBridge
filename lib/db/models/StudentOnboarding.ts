import mongoose, { Schema, Document, models, Model, Types } from "mongoose";

export interface IStudentOnboarding extends Document {
  userId: Types.ObjectId; // Reference to the main User document's _id
  clerkId: string; // Store Clerk ID for potential direct lookups
  educationalGoals?: string;
  careerAspirations?: string;
  preferredLearningStyle?: string; // e.g., 'visual', 'auditory', 'kinesthetic'
  skillsToDevelop?: string[];
  fundingNeedReason?: string; // Why they need funding
  location?: string;
  dateOfBirth?: Date;
  currentEducationLevel?: string; // e.g., 'High School', 'Undergraduate'
  fieldOfStudy?: string;
  onboardingData: Record<string, any>; // Catch-all for other form data
  completedAt: Date;
}

const StudentOnboardingSchema: Schema<IStudentOnboarding> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clerkId: { type: String, required: true, index: true },
    educationalGoals: { type: String },
    careerAspirations: { type: String },
    preferredLearningStyle: { type: String },
    skillsToDevelop: [{ type: String }],
    fundingNeedReason: { type: String },
    location: { type: String },
    dateOfBirth: { type: Date },
    currentEducationLevel: { type: String },
    fieldOfStudy: { type: String },
    onboardingData: { type: Schema.Types.Mixed }, // Flexible field for extra data
    completedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "completedAt", updatedAt: false }, // Only use completedAt
    collection: "student-onboardings", // Explicit collection name
  }
);

const StudentOnboarding: Model<IStudentOnboarding> =
  models.StudentOnboarding ||
  mongoose.model<IStudentOnboarding>(
    "StudentOnboarding",
    StudentOnboardingSchema
  );

export default StudentOnboarding;
