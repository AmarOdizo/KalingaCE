const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    courseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    fullDescription: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      required: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
    },

    certificate: {
      type: String,
      default: "Institute Certificate",
    },

    trainer: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    students: {
      type: Number,
      default: 0,
    },

    technologies: [
      {
        type: String,
      },
    ],

    features: [
      {
        type: String,
      },
    ],

    syllabus: [
      {
        type: String,
      },
    ],

    batchTiming: {
      type: String,
      default: "",
    },

    seats: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Admission Open", "Closed", "Coming Soon"],
      default: "Admission Open",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Course", CourseSchema);
