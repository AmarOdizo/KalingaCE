const mongoose = require("mongoose");

// Question Schema
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["short-answer"],
      default: "short-answer",
    },

    required: {
      type: Boolean,
      default: false,
    },

    // Question ke maximum marks
    maxMarks: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

// Student Answer Schema
const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    studentName: {
      type: String,
      default: "Anonymous Student",
    },

    mobileNumber: {
      type: String,
      default: "",
    },

    studentAnswer: {
      type: String,
      required: true,
    },

    // Admin ne answer check kiya ya nahi
    checked: {
      type: Boolean,
      default: false,
    },

    // YES / NO
    isCorrect: {
      type: Boolean,
      default: null,
    },

    // Admin dwara diye gaye marks
    marks: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

// Main SQA Schema
const sqaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamInformation",
      default: null,
    },

    questions: [questionSchema],

    // Student ke submitted answers
    answers: [answerSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SQA", sqaSchema);
