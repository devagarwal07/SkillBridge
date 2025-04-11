import React from "react";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";

type EducationSkillsStepProps = {
  formData: {
    currentLevel: string;
    institution: string;
    major: string;
    graduationDate: string;
    gpa: string;
    skills: string[];
  };
  userData: any;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
};

export default function EducationSkillsStep({
  formData,
  userData,
  errors,
  onChange,
}: EducationSkillsStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Education & Skills
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Education Level
          </label>
          <select
            value={formData.currentLevel}
            onChange={(e) => onChange("currentLevel", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="High School" className="bg-gray-800">
              High School
            </option>
            <option value="Associate's" className="bg-gray-800">
              Associate's Degree
            </option>
            <option value="Bachelor's" className="bg-gray-800">
              Bachelor's Degree
            </option>
            <option value="Master's" className="bg-gray-800">
              Master's Degree
            </option>
            <option value="Doctorate" className="bg-gray-800">
              Doctorate
            </option>
            <option value="Bootcamp" className="bg-gray-800">
              Bootcamp
            </option>
            <option value="Self-taught" className="bg-gray-800">
              Self-taught
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Institution
          </label>
          <input
            value={formData.institution}
            onChange={(e) => onChange("institution", e.target.value)}
            placeholder="University, College, or School name"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["education.institution"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["education.institution"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["education.institution"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Major / Field of Study
          </label>
          <input
            value={formData.major}
            onChange={(e) => onChange("major", e.target.value)}
            placeholder="e.g., Computer Science, Data Science"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["education.major"] ? "border-red-500" : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["education.major"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["education.major"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Expected Graduation Date
          </label>
          <input
            type="date"
            value={formData.graduationDate}
            onChange={(e) => onChange("graduationDate", e.target.value)}
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["education.graduationDate"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["education.graduationDate"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["education.graduationDate"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            GPA (if applicable)
          </label>
          <input
            value={formData.gpa}
            onChange={(e) => onChange("gpa", e.target.value)}
            placeholder="e.g., 3.5/4.0"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => {
                  const newSkills = [...formData.skills];
                  newSkills.splice(index, 1);
                  onChange("skills", newSkills);
                }}
                className="text-gray-400 hover:text-gray-200 ml-1"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Add a skill (e.g., Python, Data Analysis)"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                e.preventDefault();
                if (!formData.skills.includes(e.currentTarget.value.trim())) {
                  onChange("skills", [
                    ...formData.skills,
                    e.currentTarget.value.trim(),
                  ]);
                  e.currentTarget.value = "";
                }
              }
            }}
          />
          <button
            type="button"
            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors"
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              if (
                input.value.trim() &&
                !formData.skills.includes(input.value.trim())
              ) {
                onChange("skills", [...formData.skills, input.value.trim()]);
                input.value = "";
              }
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BadgeCheck className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-white">
              Verified Skills from Your Profile
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              The following skills have been imported from your verified skill
              assessments.
            </p>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill: any) => (
                <Badge
                  key={skill.id}
                  className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                >
                  {skill.name} ({skill.level})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
