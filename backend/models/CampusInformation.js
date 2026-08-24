const mongoose = require("mongoose");

const CampusInformationSchema = new mongoose.Schema(
  {
    campusName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    website: [
      {
        type: { type: String },
        link: { type: String },
      },
    ],

    Totalfaculty: [
      {
        type: Number,
        trim: true,
      },
    ],
    TotalAvailableStudent: [
      {
        type: Number,
        trim: true,
      },
    ],
    TotalPassedOutStudent: [
      {
        type: Number,
        trim: true,
      },
    ],
    OpeningDate: {
      type: Date,
      default: Date.now,
    },
    OpratingHours: {
      type: String,
      default: "",
    },

    mapLocation: {
      type: String,
      default: "",
    },

    isMain: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("CampusInformation", CampusInformationSchema);
