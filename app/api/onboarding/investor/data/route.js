import { NextResponse } from "next/server";
import { connectToDatabase, getDataOrMock } from "@/lib/db/mongoose";
import InvestorOnboarding from "@/lib/db/models/investorOnboarding";

// Mock data to use when DB connection fails
const mockInvestorData = {
  name: "Mock Investor",
  email: "mock.investor@example.com",
  company: "Mock Capital",
  position: "Investment Director",
  investmentFocus: ["EdTech", "AI", "Sustainability"],
  investmentStage: "Seed to Series A",
  portfolioSize: "$5M-$10M",
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
        return await InvestorOnboarding.findOne(options);
      },
      mockInvestorData,
      { $or: [{ clerkId: userId }, { userId: userId }] }
    );

    // If we actually got null from the DB (not mock data)
    if (!onboarding) {
      return NextResponse.json(
        { success: false, message: "Investor onboarding data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      onboarding,
    });
  } catch (error) {
    console.error("Error in investor onboarding data retrieval:", error);

    // Fall back to mock data in case of errors
    return NextResponse.json({
      success: true,
      onboarding: mockInvestorData,
      warning: "Using mock data due to database connection error",
    });
  }
}
