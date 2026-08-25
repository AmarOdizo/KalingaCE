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

    const selectedDateObj = new Date(examDate);
    const [hours, minutes] = examTime.split(":").map(Number);
    const selectedDateTime = new Date(
      selectedDateObj.getFullYear(),
      selectedDateObj.getMonth(),
      selectedDateObj.getDate(),
      hours,
      minutes,
      0
    );
    if (selectedDateTime.getTime() < (Date.now() - 60000)) {
      return res.status(400).json({
        success: false,
        message: "Cannot save. The selected exam date and time is in the past.",
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

    if (examDate && examTime) {
      const selectedDateObj = new Date(examDate);
      const [hours, minutes] = examTime.split(":").map(Number);
      const selectedDateTime = new Date(
        selectedDateObj.getFullYear(),
        selectedDateObj.getMonth(),
        selectedDateObj.getDate(),
        hours,
        minutes,
        0
      );
      if (selectedDateTime.getTime() < (Date.now() - 60000)) {
        return res.status(400).json({
          success: false,
          message: "Cannot save. The selected exam date and time is in the past.",
        });
      }
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

// ==============================
// TOGGLE Results Publication Status
// ==============================
router.patch("/:id/publish", async (req, res) => {
  try {
    const idParam = req.params.id;
    let exam;

    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({ id: Number(idParam) });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    exam.resultsPublished = !exam.resultsPublished;
    await exam.save();

    res.status(200).json({
      success: true,
      message: `Exam results ${exam.resultsPublished ? "published" : "unpublished"} successfully`,
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
// UPDATE Exam Status (Active/Inactive)
// ==============================
router.patch("/:id/status", async (req, res) => {
  try {
    const idParam = req.params.id;
    const { status } = req.body;

    if (!status || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Inactive",
      });
    }

    let exam;
    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({ id: Number(idParam) });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    exam.status = status;
    await exam.save();

    res.status(200).json({
      success: true,
      message: `Exam status updated to ${status} successfully`,
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
// START Exam (Manual Control)
// ==============================
router.patch("/:id/start", async (req, res) => {
  try {
    const idParam = req.params.id;
    const { examPassword } = req.body;

    let exam;
    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({ id: Number(idParam) });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    exam.status = "Started";
    exam.startTime = new Date();
    exam.closeTime = null; // Clear close time if restarting

    if (examPassword) {
      const bcrypt = require("bcryptjs");
      exam.examPassword = await bcrypt.hash(examPassword, 10);
    } else {
      exam.examPassword = null;
    }

    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam started successfully",
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
// VERIFY Exam Password
// ==============================
router.post("/:id/verify-password", async (req, res) => {
  try {
    const idParam = req.params.id;
    const { examPassword } = req.body;

    let exam;
    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({ id: Number(idParam) });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    if (!exam.examPassword) {
      return res.status(200).json({
        success: true,
        message: "No password required for this exam",
      });
    }

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(examPassword || "", exam.examPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect exam password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam password verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// CLOSE Exam (Manual Control)
// ==============================
router.patch("/:id/close", async (req, res) => {
  try {
    const idParam = req.params.id;
    let exam;
    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      exam = await ExamInformation.findById(idParam);
    } else {
      exam = await ExamInformation.findOne({ id: Number(idParam) });
    }

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam Information not found",
      });
    }

    exam.status = "Closed";
    exam.closeTime = new Date();
    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam closed successfully",
      data: exam,
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
