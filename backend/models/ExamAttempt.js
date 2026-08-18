const mongoose = require("mongoose");

const ExamAttemptSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamInformation",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalPossibleScore: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: Number,
        questionText: String,
        chosenAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        marks: Number,
      }
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamAttempt", ExamAttemptSchema);
