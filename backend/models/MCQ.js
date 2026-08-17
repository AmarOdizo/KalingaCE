const mongoose = require("mongoose");

const MCQSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === 4;
        },
        message: "Exactly 4 options are required",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    marks: {
      type: Number,
      default: 1,
      min: 1,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MCQ", MCQSchema);
