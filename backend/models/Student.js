const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },

    totalMark: {
      type: Number,
      required: true,
      min: 0,
    },

    gainMark: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    collection: "Student",
    timestamps: true,
  },
);

module.exports = mongoose.model("Student", StudentSchema);
