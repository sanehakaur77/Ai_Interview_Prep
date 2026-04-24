const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        status: {
          type: String,
          enum: ["unanswered", "answered"],
          default: "unanswered",
        },

        feedback: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("InterviewQuestion", interviewQuestionSchema);
