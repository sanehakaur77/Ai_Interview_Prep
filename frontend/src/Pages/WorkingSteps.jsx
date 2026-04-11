import React from "react";
import { UserPlus, ListChecks, Brain, BarChart } from "lucide-react";

const WorkingSteps = () => {
  const steps = [
    {
      icon: <UserPlus size={32} className="text-emerald-600" />,
      title: "Create Account",
      description: "Sign up and login securely to get started.",
    },
    {
      icon: <ListChecks size={32} className="text-emerald-600" />,
      title: "Select Role",
      description: "Choose your job role and experience level.",
    },
    {
      icon: <Brain size={32} className="text-emerald-600" />,
      title: "Practice Interview",
      description: "Answer AI-generated interview questions.",
    },
    {
      icon: <BarChart size={32} className="text-emerald-600" />,
      title: "Track Progress",
      description: "Analyze performance and improve skills.",
    },
  ];

  return (
    <section className="h-screen bg-white flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
          <p className="text-gray-500 mt-2">
            Follow these simple steps to start your preparation
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              {/* Icon */}
              <div className="mb-4">{step.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600">{step.description}</p>

              {/* Step Number */}
              <div className="mt-4 text-sm font-bold text-emerald-600">
                Step {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingSteps;
