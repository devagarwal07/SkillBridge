import { connectToDatabase } from "../mongoose";
import StudentOnboarding from "../models/studentOnboarding";
import InvestorOnboarding from "../models/investorOnboarding";

export async function saveStudentOnboardingData(formData) {
  try {
    await connectToDatabase();

    const newStudentData = new StudentOnboarding(formData);
    await newStudentData.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving student onboarding data:", error);
    return { success: false, error: error.message };
  }
}

export async function saveInvestorOnboardingData(formData) {
  try {
    await connectToDatabase();

    const newInvestorData = new InvestorOnboarding(formData);
    await newInvestorData.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving investor onboarding data:", error);
    return { success: false, error: error.message };
  }
}
