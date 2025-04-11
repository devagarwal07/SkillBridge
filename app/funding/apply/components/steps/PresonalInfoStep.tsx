import React from "react";

type PersonalInfoStepProps = {
  formData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
};

export default function PersonalInfoStep({
  formData,
  errors,
  onChange,
}: PersonalInfoStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Full Name
          </label>
          <input
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Your full name"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["personalInfo.name"] ? "border-red-500" : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["personalInfo.name"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["personalInfo.name"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="your.email@example.com"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["personalInfo.email"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["personalInfo.email"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["personalInfo.email"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Phone Number
          </label>
          <input
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="555-123-4567"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["personalInfo.phone"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["personalInfo.phone"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["personalInfo.phone"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Location
          </label>
          <input
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, State/Province, Country"
            className={`w-full px-3 py-2 bg-white/5 border ${
              errors["personalInfo.location"]
                ? "border-red-500"
                : "border-white/20"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
          {errors["personalInfo.location"] && (
            <p className="mt-1 text-sm text-red-500">
              {errors["personalInfo.location"]}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Bio / Personal Statement
        </label>
        <textarea
          rows={4}
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell us about yourself, your background, and why you're seeking funding."
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        ></textarea>
      </div>
    </div>
  );
}
