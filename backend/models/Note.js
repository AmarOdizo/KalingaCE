const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    noteTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Thumbnail Image (ImageKit)
    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      fileId: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
      },
    },

    // PDF File (ImageKit)
    pdf: {
      url: {
        type: String,
        required: true,
      },
      fileId: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
      },
    },

    uploadedBy: {
      type: String,
      required: true,
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
    collection: "Note",
  },
);

module.exports = mongoose.model("Note", NoteSchema);
