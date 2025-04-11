import { NextResponse } from "next/server";
import { connectToDatabase, getDataOrMock } from "@/lib/db/mongoose";
import StudentOnboarding from "@/lib/db/models/studentOnboarding";

// Mock data to use when DB connection fails
const mockStudentData = {
  name: "Mock Student",
  email: "mock.student@example.com",
  institution: "Mock University",
  courseOfStudy: "Computer Science",
  yearOfStudy: "3rd Year",
  skills: ["JavaScript", "React", "Node.js"],
  interests: ["AI", "Web Development", "Cloud Computing"],
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Try to get data from DB, fall back to mock if connection fails
    const onboarding = await getDataOrMock(
      async (options) => {
        await connectToDatabase();
        return await StudentOnboarding.findOne(options);
      },
      mockStudentData,
      { $or: [{ clerkId: userId }, { userId: userId }] }
    );

    // If we actually got null from the DB (not mock data)
    if (!onboarding) {
      return NextResponse.json(
        { success: false, message: "Student onboarding data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      onboarding,
    });
  } catch (error) {
    console.error("Error in student onboarding data retrieval:", error);

    // Fall back to mock data in case of errors
    return NextResponse.json({
      success: true,
      onboarding: mockStudentData,
      warning: "Using mock data due to database connection error",
    });
  }
}
