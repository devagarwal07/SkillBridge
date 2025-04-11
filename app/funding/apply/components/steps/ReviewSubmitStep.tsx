import React from "react";
import { Edit, File, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ReviewSubmitStepProps = {
  formData: any;
  onEdit: (step: number) => void;
};

export default function ReviewSubmitStep({
  formData,
  onEdit,
}: ReviewSubmitStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Review & Submit</h2>
      <p className="text-gray-300 mb-6">
        Please review all information before submitting your application.
      </p>

      <div className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">Personal Information</h3>
            <button
              onClick={() => onEdit(0)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Full Name:</span>
              <div className="font-medium text-white">
                {formData.personalInfo.name}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <div className="font-medium text-white">
                {formData.personalInfo.email}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <div className="font-medium text-white">
                {formData.personalInfo.phone}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Location:</span>
              <div className="font-medium text-white">
                {formData.personalInfo.location}
              </div>
            </div>
          </div>
        </div>

        {/* Education & Skills Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">Education & Skills</h3>
            <button
              onClick={() => onEdit(1)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-400">Education Level:</span>
              <div className="font-medium text-white">
                {formData.education.currentLevel}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Institution:</span>
              <div className="font-medium text-white">
                {formData.education.institution}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Major:</span>
              <div className="font-medium text-white">
                {formData.education.major}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Graduation Date:</span>
              <div className="font-medium text-white">
                {formData.education.graduationDate}
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Skills:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.education.skills.map((skill: string, index: number) => (
                <Badge
                  key={index}
                  className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Funding Goals Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">Funding Goals</h3>
            <button
              onClick={() => onEdit(2)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-400">Amount Requested:</span>
              <div className="font-medium text-white">
                ${formData.funding.amount}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Timeline:</span>
              <div className="font-medium text-white">
                {formData.funding.timeline}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Preferred Model:</span>
              <div className="font-medium text-white">
                {formData.funding.preferredModel}
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Purpose:</span>
            <div className="mt-1 text-white">{formData.funding.purpose}</div>
          </div>
        </div>

        {/* Career Plans Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">Career Plans</h3>
            <button
              onClick={() => onEdit(3)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-400">Short-Term Goals:</span>
              <div className="mt-1 text-white">
                {formData.career.shortTermGoals}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Long-Term Goals:</span>
              <div className="mt-1 text-white">
                {formData.career.longTermGoals}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Target Industries:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.career.targetIndustries.map(
                  (industry: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                    >
                      {industry}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Target Roles:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.career.targetRoles.map(
                  (role: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                    >
                      {role}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Expected Salary:</span>
              <div className="font-medium text-white">
                ${formData.career.salaryExpectations}
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">Documentation</h3>
            <button
              onClick={() => onEdit(4)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-400">Resume:</span>
              <div className="mt-1">
                {formData.documents.resume ? (
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-indigo-400" />
                    <span className="text-white">
                      {(formData.documents.resume as any).name || "resume.pdf"}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-300">No resume uploaded</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Transcript:</span>
              <div className="mt-1">
                {formData.documents.transcript ? (
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-indigo-400" />
                    <span className="text-white">
                      {(formData.documents.transcript as any).name ||
                        "transcript.pdf"}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-300">No transcript uploaded</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Portfolio Link:</span>
              <div className="mt-1 text-white">
                {formData.documents.portfolioLink || (
                  <span className="text-gray-300">
                    No portfolio link provided
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Additional Links:</span>
              <div className="mt-2">
                {formData.documents.additionalLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.documents.additionalLinks.map(
                      (link: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                        >
                          {link}
                        </Badge>
                      )
                    )}
                  </div>
                ) : (
                  <span className="text-gray-300">
                    No additional links provided
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-lg mt-8">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-white">Before you submit</h3>
            <p className="text-sm text-gray-300 mt-1">
              By submitting this application, you confirm that all information
              provided is accurate and complete. Your application will be
              reviewed by our team and the investors you selected or matched
              with. You'll receive email notifications about the status of your
              application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
