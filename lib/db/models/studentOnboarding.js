import mongoose from "mongoose";

const StudentOnboardingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  courseOfStudy: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  interests: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentOnboarding =
  mongoose.models.StudentOnboarding ||
  mongoose.model(
    "StudentOnboarding",
    StudentOnboardingSchema,
    "student-onboarding"
  );

export default StudentOnboarding;
