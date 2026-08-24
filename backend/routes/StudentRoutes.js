

const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const StudentCounter = require("../models/StudentCounter");

const upload = require("../middleware/upload");
const { uploadStudentImage } = require("../controllers/StudentController");
const imagekit = require("../config/imagekit");

// ==============================
// GET All Students
// ==============================
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ id: 1 }).populate("examId");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// GET Student By ID
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findOne({
      id: Number(req.params.id),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, subject, batch, totalMark, gainMark } = req.body;

    if (!name || !subject || !batch || !totalMark || !gainMark) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
        folder: "/Student",
      });

      imageUrl = result.url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const counter = await StudentCounter.findByIdAndUpdate(
      "studentId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const student = new Student({
      id: counter.seq,
      name,
      subject,
      batch,
      totalMark,
      gainMark,
      image: imageUrl,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student Added Successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// UPDATE Student
// ==============================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, subject, batch, totalMark, gainMark } = req.body;

    const student = await Student.findOne({
      id: Number(req.params.id),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    let imageUrl = student.image;

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
        folder: "/Student",
      });

      imageUrl = result.url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    student.name = name;
    student.subject = subject;
    student.batch = batch;
    student.totalMark = totalMark;
    student.gainMark = gainMark;
    student.image = imageUrl;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// DELETE Student
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==============================
// TOGGLE Student Topper Publication Status
// ==============================
router.patch("/:id/publish", async (req, res) => {
  try {
    const idParam = req.params.id;
    let student;

    if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
      student = await Student.findById(idParam);
    } else {
      student = await Student.findOne({ id: Number(idParam) });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Topper student not found",
      });
    }

    student.published = !student.published;
    await student.save();

    res.status(200).json({
      success: true,
      message: `Topper results ${student.published ? "published" : "unpublished"} successfully`,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/upload", upload.single("image"), uploadStudentImage);

module.exports = router;
