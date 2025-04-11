import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import StudentOnboarding from "@/lib/db/models/studentOnboarding";
import InvestorOnboarding from "@/lib/db/models/investorOnboarding";

export async function POST(request) {
  try {
    // Parse request body
    const data = await request.json();
    console.log("Received data:", JSON.stringify(data, null, 2));

    // Check for role in different possible locations based on the forms we saw
    let role = data.role;

    // Handle nested data structures like in the investor onboarding form
    if (!role && data.personalDetails && data.personalDetails.role) {
      role = data.personalDetails.role;
    }

    // If role is still not found but we have enough information to determine the type
    if (!role) {
      // Check for student-specific fields
      if (data.education && data.education.institution) {
        role = "student";
      } else if (data.institution) {
        role = "student";
      }
      // Check for investor-specific fields
      else if (
        (data.investment && data.investment.focusAreas) ||
        data.company ||
        data.investmentFocus
      ) {
        role = "investor";
      }
    }

    if (!role || (role !== "student" && role !== "investor")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User role ('student' or 'investor') is required in data payload.",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Save data to the appropriate collection based on role
    if (role === "student") {
      // Check if we're dealing with the simple structure (direct properties)
      // or the nested structure (with personalDetails, education, etc.)
      let studentModelData;

      if (data.name && data.email && data.institution) {
        // Simple structure from student/page.js
        studentModelData = {
          name: data.name,
          email: data.email,
          institution: data.institution,
          courseOfStudy: data.courseOfStudy || "",
          yearOfStudy: data.yearOfStudy || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          interests: Array.isArray(data.interests) ? data.interests : [],
          role: "student",
        };
      } else {
        // Nested structure from onboarding/page.jsx
        studentModelData = {
          name: data.personalDetails?.name || "",
          email: data.personalDetails?.email || "",
          institution: data.education?.institution || "",
          courseOfStudy: data.education?.major || "",
          yearOfStudy: data.education?.gradYear || "",
          skills: Array.isArray(data.skills?.selectedSkills)
            ? data.skills.selectedSkills
            : [],
          interests: Array.isArray(data.skills?.interests)
            ? data.skills.interests
            : [],
          role: "student",
        };
      }

      console.log("Formatted student data:", studentModelData);

      // Check if all required fields are present
      if (
        !studentModelData.name ||
        !studentModelData.email ||
        !studentModelData.institution
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing required fields for student onboarding",
          },
          { status: 400 }
        );
      }

      const studentData = new StudentOnboarding(studentModelData);
      await studentData.save();
    } else if (role === "investor") {
      // Check if we're dealing with the simple structure or the nested structure
      let investorModelData;

      if (data.name && data.email && data.company) {
        // Simple structure from investor/page.js
        investorModelData = {
          name: data.name,
          email: data.email,
          company: data.company,
          position: data.position || "",
          investmentFocus: Array.isArray(data.investmentFocus)
            ? data.investmentFocus
            : [],
          investmentStage: data.investmentStage || "",
          portfolioSize: data.portfolioSize || "",
          role: "investor",
        };
      } else {
        // Nested structure from onboarding/investor/page.jsx
        investorModelData = {
          name: data.personalDetails?.name || "",
          email: data.personalDetails?.email || "",
          company: data.company || data.professional?.company || "",
          position: data.position || data.professional?.position || "",
          investmentFocus:
            data.investmentFocus ||
            (data.investment?.focusAreas ? data.investment.focusAreas : []),
          investmentStage:
            data.investmentStage || data.investment?.investmentStage || "",
          portfolioSize: data.portfolioSize || data.investment?.checkSize || "",
          role: "investor",
        };
      }

      console.log("Formatted investor data:", investorModelData);

      // Check if all required fields are present
      if (
        !investorModelData.name ||
        !investorModelData.email ||
        !investorModelData.company
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing required fields for investor onboarding",
          },
          { status: 400 }
        );
      }

      const investorData = new InvestorOnboarding(investorModelData);
      await investorData.save();
    }

    return NextResponse.json({
      success: true,
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } onboarding completed successfully`,
    });
  } catch (error) {
    console.error("Error in onboarding:", error);

    // Return more detailed error message to help debugging
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save onboarding data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
