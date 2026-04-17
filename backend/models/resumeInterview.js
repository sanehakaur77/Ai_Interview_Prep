const mongoose = require("mongoose");

const resumeInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
      },
    ],

    answers: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true },
);

const ResumeInterview = mongoose.model(
  "ResumeBasedInterview",
  resumeInterviewSchema,
);

module.exports = ResumeInterview;
