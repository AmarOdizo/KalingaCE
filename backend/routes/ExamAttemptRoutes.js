const express = require("express");
const router = express.Router();
const ExamAttempt = require("../models/ExamAttempt");

const updateToppersForExam = async (examId) => {
  try {
    const Student = require("../models/Student");
    const StudentCounter = require("../models/StudentCounter");
    const ExamInfo = require("../models/ExamInfo");

    const exam = await ExamInfo.findById(examId);
    if (!exam) return;

    // 1. Fetch all attempts for this exam
    const attempts = await ExamAttempt.find({ examId });
    if (attempts.length === 0) {
      // If no attempts, delete all toppers for this exam
      await Student.deleteMany({ examId });
      return;
    }

    // 2. Find the maximum score
    const maxScore = Math.max(...attempts.map((a) => a.score));

    // 3. Find all students/attempts with this maximum score
    const winningAttempts = attempts.filter((a) => a.score === maxScore);

    // 4. Delete existing toppers for this exam
    await Student.deleteMany({ examId });

    // 5. Create new toppers for each winning attempt
    const subjectName = exam.examName || "Online MCQ Exam";
    const currentYear = new Date().getFullYear().toString();

    for (const win of winningAttempts) {
      const counter = await StudentCounter.findByIdAndUpdate(
        "studentId",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      await Student.create({
        id: counter.seq,
        name: win.studentName,
        subject: subjectName,
        batch: currentYear,
        totalMark: win.totalPossibleScore,
        gainMark: win.score,
        image: "",
        examId: examId,
        attemptId: win._id,
      });
    }
  } catch (err) {
    console.error("Error updating toppers:", err);
  }
};

// Get all exam attempts (for admin)
router.get("/", async (req, res) => {
  try {
    const attempts = await ExamAttempt.find()
      .sort({ createdAt: -1 })
      .populate("examId");

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam attempts",
      error: error.message,
    });
  }
});

// Submit a new exam attempt
router.post("/", async (req, res) => {
  try {
    const { studentName, mobileNumber, examId, score, totalPossibleScore, answers } = req.body;

    if (!studentName || !mobileNumber || !examId || score === undefined || totalPossibleScore === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const attempt = await ExamAttempt.create({
      studentName,
      mobileNumber,
      examId,
      score,
      totalPossibleScore,
      answers,
    });

    await updateToppersForExam(examId);

    res.status(201).json({
      success: true,
      message: "Attempt submitted successfully",
      data: attempt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save attempt",
      error: error.message,
    });
  }
});

// Check if a mobile number has attempted this exam in the last 5 minutes
router.post("/check", async (req, res) => {
  try {
    const { examId, mobileNumber } = req.body;

    if (!examId || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and mobile number are required",
      });
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const attempt = await ExamAttempt.findOne({
      examId,
      mobileNumber,
      submittedAt: { $gte: fiveMinutesAgo },
    });

    if (attempt) {
      return res.status(200).json({
        success: true,
        hasAttempted: true,
        attempt,
      });
    }

    res.status(200).json({
      success: true,
      hasAttempted: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check attempt status",
      error: error.message,
    });
  }
});

// Update attempt score (for SQA descriptive grading updates)
router.put("/:id", async (req, res) => {
  try {
    const { score } = req.body;
    const attempt = await ExamAttempt.findByIdAndUpdate(
      req.params.id,
      { score },
      { new: true }
    );
    if (!attempt) {
      return res.status(404).json({ success: false, message: "Attempt not found" });
    }
    
    // Recalculate toppers for this exam
    await updateToppersForExam(attempt.examId);

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update score", error: error.message });
  }
});

module.exports = router;
