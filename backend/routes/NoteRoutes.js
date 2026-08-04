const express = require("express");
const router = express.Router();

const Note = require("../models/Note");
const NoteCounter = require("../models/NoteCounter");

const upload = require("../middleware/upload");
const { uploadFile } = require("../controllers/NoteController");

const imagekit = require("../config/imagekit");

// ==============================
// GET All Notes
// ==============================
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// GET Note By ID
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({
      id: Number(req.params.id),
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// CREATE Note
// ==============================
router.post("/", async (req, res) => {
  try {
    const {
      subjectName,
      noteTitle,
      description,
      thumbnail,
      pdf,
      uploadedBy,
      status,
    } = req.body;

    if (!subjectName || !noteTitle || !thumbnail || !pdf || !uploadedBy) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    const counter = await NoteCounter.findByIdAndUpdate(
      "noteId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const note = new Note({
      id: counter.seq,
      subjectName,
      noteTitle,
      description,
      thumbnail,
      pdf,
      uploadedBy,
      status,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note Added Successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// UPDATE Note
// ==============================
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({
      id: Number(req.params.id),
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.subjectName = req.body.subjectName;
    note.noteTitle = req.body.noteTitle;
    note.description = req.body.description;
    note.thumbnail = req.body.thumbnail;
    note.pdf = req.body.pdf;
    note.uploadedBy = req.body.uploadedBy;
    note.status = req.body.status;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note Updated Successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// DELETE Note
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// Upload Thumbnail / PDF
// ==============================
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
