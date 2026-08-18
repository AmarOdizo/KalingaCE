const mongoose = require("mongoose");

const ExamInformationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
      required: true,
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
  },
  {
    collection: "ExamInformation",
    timestamps: true,
  },
);

module.exports = mongoose.model("ExamInformation", ExamInformationSchema);
