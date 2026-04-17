import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw, MessageSquare } from "lucide-react";

const Evaluate = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8989/api/resume/evaluate",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setData(res.data.evaluation);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvaluation();
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* TOP NAV */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Interview Evaluation
          </h1>

          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500">Interview Insights</span>
            <span className="text-emerald-600 font-semibold">
              Performance Report
            </span>

            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold">
              Award 100
            </div>
          </div>
        </div>

        {/* OVERALL */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-gray-700">Overall Performance</p>

            <button
              onClick={() => (window.location.href = "/interview")}
              className="flex items-center gap-2 text-sm bg-white border px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50"
            >
              <RefreshCcw size={14} />
              Try Again
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* CIRCLE */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-[8px] border-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full border-[8px] border-emerald-500"
                style={{
                  clipPath: `inset(${100 - data.overallScore}% 0 0 0)`,
                }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">
                {data.overallScore}%
              </div>
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <h2 className="font-semibold text-slate-800 mb-2">
                Overall Assessment
              </h2>

              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600 relative">
                <MessageSquare
                  size={16}
                  className="absolute right-3 top-3 text-gray-400"
                />
                {data.overallFeedback}
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION SECTION */}
        <p className="text-sm font-semibold text-gray-500 uppercase mb-4">
          Question Breakdown
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((item, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-semibold">
                  STEP {i + 1}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {item.score}/10
                </span>
              </div>

              {/* QUESTION */}
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                {item.question}
              </h3>

              {/* RESPONSE */}
              <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 mb-3">
                <p className="font-semibold text-gray-700 mb-1">
                  Candidate Response
                </p>
                {item.answer || "No response"}
              </div>

              {/* STRENGTH + WEAKNESS */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-emerald-100 p-2 rounded-md text-xs">
                  <p className="font-semibold text-emerald-700">Strength</p>
                  <p className="text-gray-700 mt-1">
                    {item.strengths || "Good understanding"}
                  </p>
                </div>

                <div className="bg-red-100 p-2 rounded-md text-xs">
                  <p className="font-semibold text-red-600">Weakness</p>
                  <p className="text-gray-700 mt-1">{item.weaknesses}</p>
                </div>
              </div>

              {/* FOOTER */}
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Expert Note: </span>
                {item.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluate;
