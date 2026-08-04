const mongoose = require("mongoose");

const ExamInformationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },

    batch: {
      type: [String],
      required: true,
      trim: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    // ImageKit Image URL
    image: {
      type: String,
      default: "",
    },

    examDate: {
      type: Date,
      required: true,
    },

    examTime: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  {
    collection: "ExamInformation",
    timestamps: true,
  },
);

module.exports = mongoose.model("ExamInformation", ExamInformationSchema);
