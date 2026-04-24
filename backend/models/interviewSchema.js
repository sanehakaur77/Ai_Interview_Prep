const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["Behavioral", "Technical", "HR"],
      default: "Behavioral",
    },

    resumeUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["created", "started", "completed"],
      default: "created",
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
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", interviewSchema);
