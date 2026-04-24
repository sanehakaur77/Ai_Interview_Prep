import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  Mic,
  BarChart3,
  Upload,
  ChevronDown,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
      {icon}
    </div>
    <span className="font-semibold text-slate-700 text-xs">{text}</span>
  </div>
);

export default function StartInterviewForm() {
  // ✅ STATE
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  // navigatio
  const navigate = useNavigate();

  // ✅ SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("jobRole", jobRole);
      formData.append("experience", experience);
      formData.append("interviewType", interviewType);
      formData.append("resume", resume);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8989/session/start",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
      setTimeout(() => {
        if (res.data.success) {
          toast.success("Interview Session has been created successfully!");
        }
        navigate("/smart-interview");
      }, 2000);

      console.log("API Response:", res.data);

      const { sessionId, questions, resumeUrl } = res.data;

      // store for next page
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("questions", JSON.stringify(questions));
      localStorage.setItem("resumeUrl", resumeUrl);

      alert("Interview Started Successfully!");

      // 👉 optional redirect (if using react-router)
      // navigate(`/interview/${sessionId}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-gradient-to-br from-emerald-400 to-teal-500 p-8 flex flex-col justify-center border-r border-white/10">
          <div className="space-y-1 mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">
              AI Interview
            </h1>
            <p className="text-emerald-50 text-[11px] leading-relaxed opacity-90">
              Practice with real-time feedback.
            </p>
          </div>

          <div className="space-y-2.5">
            <FeatureItem
              icon={<User className="w-3.5 h-3.5" />}
              text="Role Selection"
            />
            <FeatureItem
              icon={<Mic className="w-3.5 h-3.5" />}
              text="Voice Analysis"
            />
            <FeatureItem
              icon={<BarChart3 className="w-3.5 h-3.5" />}
              text="Instant Results"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-lg font-bold text-slate-800 mb-5">
            Setup Session
          </h2>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Job Role */}
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Job Role"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            {/* Experience */}
            <div className="relative group">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            {/* Interview Type */}
            <div className="relative">
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs appearance-none focus:outline-none focus:border-emerald-500 text-slate-600"
              >
                <option>Technical</option>
                <option>Behavioral</option>
                <option>HR Screening</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            </div>

            {/* Resume Upload */}
            <div className="group border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg py-3 flex flex-col items-center justify-center transition-all cursor-pointer">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="text-emerald-600 w-4 h-4 mb-1" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Resume
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </label>

              {/* Show file name */}
              {resume && (
                <p className="text-[10px] text-emerald-600 mt-1">
                  {resume.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
