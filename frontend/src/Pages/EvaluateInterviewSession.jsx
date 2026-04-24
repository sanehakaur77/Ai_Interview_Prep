import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  MessageSquare,
  ChevronRight,
  Award,
} from "lucide-react";
import { motion } from "framer-motion"; // Optional: for smooth fade-ins

export default function EvaluateInterviewSession() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const url = "http://localhost:8989/session/result/69e9d56a16dd09879c977423";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch result");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 text-slate-900">
      {/* GLOSSY HEADER */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-slate-200/60 mb-8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              InsightAI{" "}
              <span className="text-slate-400 font-light mx-2">|</span>{" "}
              Evaluation
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            Session ID: ...{data?._id?.slice(-8)}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* HERO SECTION: SCORE & SUMMARY */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Score Circle */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award size={80} className="text-emerald-600" />
            </div>
            <p className="text-slate-500 font-medium mb-4">
              Overall Performance
            </p>
            <div className="relative flex items-center justify-center">
              {/* Decorative Ring */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * data.overallScore) / 100}
                  className="text-emerald-500 stroke-round transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-3xl font-bold">
                {data.overallScore}%
              </span>
            </div>
            <div
              className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                data.overallScore >= 80
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {data.overallScore >= 80 ? "Top Talent" : "Solid Candidate"}
            </div>
          </div>

          {/* Detailed Summary Bento Box */}
          <div className="lg:col-span-2  rounded-3xl p-8 shadow-xl text-black relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Target size={20} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Executive Summary
                </span>
              </div>
              <p className=" leading-relaxed text-lg italic">
                "{data.summary}"
              </p>
              <div className="mt-auto pt-6 flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                  <p className="text-[10px] text-slate-400 uppercase">
                    Analysis Confidence
                  </p>
                  <p className="text-sm font-bold text-emerald-400">98.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare size={22} className="text-emerald-500" />
              Question-wise Breakdown
            </h2>
          </div>

          <div className="grid gap-4">
            {data.questions.map((q, index) => (
              <div
                key={q._id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  {/* Q-Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                        Question 0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-800 leading-snug">
                        {q.question}
                      </h3>
                    </div>
                    <ScoreBadge score={q.score} />
                  </div>

                  {/* Answer Block */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">
                      Candidate's Response
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {q.answer?.trim() ? (
                        q.answer
                      ) : (
                        <span className="italic text-slate-400 underline">
                          No response captured during the session.
                        </span>
                      )}
                    </p>
                  </div>

                  {/* AI Feedback - Modernized */}
                  {q.feedback && (
                    <div className="flex gap-3 items-start bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                      <div className="mt-1 bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase mb-1">
                          AI Recommendation
                        </p>
                        <p className="text-sm text-emerald-900/80 leading-relaxed italic">
                          {q.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-component for badges
function ScoreBadge({ score }) {
  const isStrong = score >= 7;
  const isAverage = score >= 4;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
        isStrong
          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
          : isAverage
            ? "bg-amber-50 border-amber-100 text-amber-700"
            : "bg-rose-50 border-rose-100 text-rose-700"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${isStrong ? "bg-emerald-500" : isAverage ? "bg-amber-500" : "bg-rose-500"}`}
      />
      <span className="text-sm font-bold">{score}/10</span>
    </div>
  );
}

// Loading Component
function LoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">
        Running Deep Analysis...
      </p>
    </div>
  );
}

// Error Component
function ErrorState({ message }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-6 text-center">
      <div className="max-w-md">
        <div className="bg-rose-100 text-rose-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-500 mb-6">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
