import React from "react";
import {
  User,
  Briefcase,
  Mic,
  BarChart3,
  Upload,
  ChevronDown,
} from "lucide-react";
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
    <div className="bg-green-50 p-2 rounded-lg">{icon}</div>
    <span className="font-semibold text-[#1a2e35]">{text}</span>
  </div>
);
export default function StartInterviewForm() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Left Side */}
        <div className="md:w-1/2 bg-emerald-300 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-[#1a2e35] mb-3">
            Start Your AI Interview
          </h1>

          <p className="text-sm text-[#5b7078] mb-6">
            Practice real interview scenarios powered by AI.
          </p>

          <div className="space-y-3">
            <FeatureItem
              icon={<User className="text-green-600 w-4 h-4" />}
              text="Choose Role"
            />
            <FeatureItem
              icon={<Mic className="text-green-600 w-4 h-4" />}
              text="Voice Interview"
            />
            <FeatureItem
              icon={<BarChart3 className="text-green-600 w-4 h-4" />}
              text="Analytics"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-6 bg-white">
          <h2 className="text-xl font-semibold text-[#1a2e35] mb-5">
            Interview Setup
          </h2>

          <form className="space-y-4">
            {/* Role */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Role"
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Experience */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Experience"
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Select */}
            <div className="relative">
              <select className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-green-500">
                <option>Technical</option>
                <option>HR</option>
                <option>Behavioral</option>
              </select>
            </div>

            {/* Upload */}
            <div className="border border-dashed border-green-400 rounded-lg p-4 flex flex-col items-center text-sm cursor-pointer">
              <Upload className="text-green-600 w-5 h-5 mb-2" />
              Upload Resume
            </div>

            {/* Button */}
            <button className="w-full bg-gray-700 hover:bg-gray-900 text-white py-2.5 rounded-full text-sm font-semibold">
              Start Interview
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
