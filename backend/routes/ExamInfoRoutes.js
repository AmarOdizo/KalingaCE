const express = require("express");
const router = express.Router();

const ExamInformation = require("../models/ExamInfo");
const ExamInfoCounter = require("../models/ExamInfoCounter");

const upload = require("../middleware/upload");
const { uploadExamInfoImage } = require("../controllers/ExamInfoController");

const imagekit = require("../config/imagekit");

// ==============================
// GET All Exam Information
// ==============================
router.get("/", async (req, res) => {
  try {
    const exams = await ExamInformation.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// GET Exam Information By ID
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    let exam;

    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({
        id: Number(idParam),
      });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ==============================
// CREATE Exam Information
// ==============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      batch,
      examName,
      mode,
      examDate,
      examTime,
      duration,
      venue,
    } = req.body;

    if (
      !batch ||
      !examName ||
      !mode ||
      !examDate ||
      !examTime ||
      !duration ||
      !venue
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
        folder: "/ExamInformation",
      });

      imageUrl = result.url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const counter = await ExamInfoCounter.findByIdAndUpdate(
      "examInfoId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const sanitizedMode = (mode && mode.toLowerCase() === "online") ? "Online" : "Offline";

    const exam = new ExamInformation({
      id: counter.seq,
      batch,
      examName,
      mode: sanitizedMode,
      image: imageUrl,
      examDate,
      examTime,
      duration,
      venue,
    });

    await exam.save();

    res.status(201).json({
      success: true,
      message: "Exam Information Added Successfully",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// UPDATE Exam Information
// ==============================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      batch,
      examName,
      mode,
      examDate,
      examTime,
      duration,
      venue,
    } = req.body;

    const idParam = req.params.id;
    let exam;

    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({
        id: Number(idParam),
      });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    let imageUrl = exam.image;

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
        folder: "/ExamInformation",
      });

      imageUrl = result.url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const sanitizedMode = (mode && mode.toLowerCase() === "online") ? "Online" : "Offline";

    exam.batch = batch;
    exam.examName = examName;
    exam.mode = sanitizedMode;
    exam.image = imageUrl;
    exam.examDate = examDate;
    exam.examTime = examTime;
    exam.duration = duration;
    exam.venue = venue;

    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam Information Updated Successfully",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ==============================
// DELETE Exam Information
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    let exam;

    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findByIdAndDelete(idParam);
    } else {
      exam = await ExamInformation.findOneAndDelete({
        id: Number(idParam),
      });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam Information Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.post("/upload", upload.single("image"), uploadExamInfoImage);

module.exports = router;
