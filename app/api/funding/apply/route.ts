import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongoose"; // Corrected import for default export
import Proposal from "@/lib/db/models/Proposal"; // Import the new Proposal model
// import { auth } from "@clerk/nextjs/server"; // Removed Clerk auth as it's not needed

export async function POST(request: Request) {
  console.log("--- Received POST request to /api/funding/apply ---");
  try {
    // Step 1: Authentication removed as per requirement.

    // Step 2: Parse request body
    console.log("Step 2: Parsing request body...");
    const formData = await request.json();
    console.log("Parsed formData:", JSON.stringify(formData, null, 2));

    // 3. Validate incoming data (adjust for Proposal schema)
    console.log("Step 3: Validating incoming data...");
    // Basic check: Ensure personalInfo and fundingGoals are present
    if (!formData || !formData.personalInfo || !formData.fundingGoals) {
      return NextResponse.json(
        {
          error: "Missing required proposal data: personalInfo or fundingGoals",
        },
        { status: 400 }
      );
    }

    // More specific validation (example)
    if (
      !formData.personalInfo.firstName ||
      !formData.personalInfo.lastName ||
      !formData.personalInfo.email ||
      !formData.fundingGoals.amountRequested ||
      !formData.fundingGoals.purpose ||
      !formData.fundingGoals.courseName ||
      !formData.fundingGoals.institutionName
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields within personalInfo or fundingGoals",
        },
        { status: 400 }
      );
    }
    console.log("Data validation passed.");

    // 4. Connect to Database
    console.log("Step 4: Connecting to database...");
    await connectToDB();
    console.log("Database connection successful.");

    // Step 5: Prepare data for saving using Proposal schema
    console.log("Step 5: Preparing data for saving...");
    // Remove userId from the data being saved
    const proposalData = {
      // userId: userId, // Removed userId
      personalInfo: formData.personalInfo,
      fundingGoals: formData.fundingGoals,
      financialInfo: formData.financialInfo, // Optional
      essayOrStatement: formData.essayOrStatement, // Optional
      supportingDocuments: formData.supportingDocuments, // Optional
      status: "submitted", // Set initial status for Proposal
    };
    console.log(
      "Prepared proposalData:",
      JSON.stringify(proposalData, null, 2)
    );

    // 6. Create and save the proposal
    console.log("Step 6: Creating and saving the proposal...");
    const newProposal = new Proposal(proposalData);
    const savedProposal = await newProposal.save();
    console.log(
      `Proposal saved successfully! Document ID: ${savedProposal._id}`
    );

    // 7. Return success response
    console.log("Step 7: Returning success response.");
    return NextResponse.json(
      {
        message: "Proposal submitted successfully!",
        data: savedProposal, // Return the saved document
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("--- Error submitting funding application ---");
    console.error("Error details:", error);
    // Handle potential Mongoose validation errors specifically
    if (error instanceof mongoose.Error.ValidationError) {
      // More specific type check
      console.error("Validation Error details (message):", error.message);
      // Log the specific errors object for detailed field issues
      console.error(
        "Validation Error details (errors object):",
        JSON.stringify(error.errors, null, 2)
      );
      return NextResponse.json(
        // Return the detailed errors object to the frontend if helpful
        { error: "Validation Error", details: error.errors },
        { status: 400 }
      );
    } // This closing brace belongs to the if statement

    // Log other types of errors that are not ValidationErrors
    console.error("Non-validation error details:", error); // 'error' is accessible here
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Add mongoose import if not already implicitly available (though it should be via Proposal)
import mongoose from "mongoose";
