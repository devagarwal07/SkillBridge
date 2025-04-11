import React from "react";
import { Upload, File, FileCheck, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type DocumentationStepProps = {
  formData: {
    resume: any;
    transcript: any;
    portfolioLink: string;
    additionalLinks: string[];
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
};

export default function DocumentationStep({
  formData,
  errors,
  onChange,
}: DocumentationStepProps) {
  const addLink = (value: string, input: HTMLInputElement) => {
    if (value.trim() && !formData.additionalLinks.includes(value.trim())) {
      onChange("additionalLinks", [...formData.additionalLinks, value.trim()]);
      input.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Supporting Documentation
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Resume / CV
          </label>
          <div
            className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => {
              const input = document.getElementById(
                "resume-upload"
              ) as HTMLInputElement;
              if (input) input.click();
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-indigo-400 mb-2" />
              <span className="font-medium text-white">
                Click to upload or drag and drop
              </span>
              <span className="text-sm text-gray-400">PDF, DOCX up to 5MB</span>
            </div>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onChange("resume", e.target.files[0]);
                }
              }}
            />
          </div>
          {formData.resume && (
            <div className="mt-3 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-indigo-400" />
                <span className="text-white">
                  {(formData.resume as any).name || "resume.pdf"}
                </span>
              </div>
              <button
                onClick={() => onChange("resume", null)}
                className="text-gray-300 hover:text-white"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Academic Transcript
          </label>
          <div
            className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => {
              const input = document.getElementById(
                "transcript-upload"
              ) as HTMLInputElement;
              if (input) input.click();
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-indigo-400 mb-2" />
              <span className="font-medium text-white">
                Click to upload or drag and drop
              </span>
              <span className="text-sm text-gray-400">PDF up to 5MB</span>
            </div>
            <input
              id="transcript-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onChange("transcript", e.target.files[0]);
                }
              }}
            />
          </div>
          {formData.transcript && (
            <div className="mt-3 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-indigo-400" />
                <span className="text-white">
                  {(formData.transcript as any).name || "transcript.pdf"}
                </span>
              </div>
              <button
                onClick={() => onChange("transcript", null)}
                className="text-gray-300 hover:text-white"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Portfolio or Project Link
          </label>
          <input
            value={formData.portfolioLink}
            onChange={(e) => onChange("portfolioLink", e.target.value)}
            placeholder="https://your-portfolio.com"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">
            Include a link to your portfolio, GitHub, project website, or other
            relevant work.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Additional Links
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.additionalLinks.map((link, index) => (
              <Badge
                key={index}
                className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-1"
              >
                {link}
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = [...formData.additionalLinks];
                    newLinks.splice(index, 1);
                    onChange("additionalLinks", newLinks);
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
              placeholder="Add a link (e.g., LinkedIn, Medium)"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  addLink(e.currentTarget.value, e.currentTarget);
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addLink(input.value, input);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-lg mt-6">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-white">
              Notes about document submission
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              All documents you submit will be handled securely and only shared
              with the investors you select or are matched with. Original
              academic documents may be required for verification at a later
              stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
