import { NextResponse } from "next/server";
import { saveInvestorOnboardingData } from "@/lib/db/actions/onboarding";

export async function POST(request) {
  try {
    const formData = await request.json();
    const result = await saveInvestorOnboardingData(formData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Investor onboarding data saved successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
