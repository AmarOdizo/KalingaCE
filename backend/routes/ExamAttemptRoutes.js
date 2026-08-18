const express = require("express");
const router = express.Router();
const ExamAttempt = require("../models/ExamAttempt");

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

    // Check for 90% or above marks to auto-save in Topper Student collection
    if (totalPossibleScore > 0) {
      const percentage = (score / totalPossibleScore) * 105; // Wait, percentage calculation is (score / totalPossibleScore) * 100
      const actualPercentage = (score / totalPossibleScore) * 100;
      if (actualPercentage >= 90) {
        try {
          const Student = require("../models/Student");
          const StudentCounter = require("../models/StudentCounter");
          const ExamInfo = require("../models/ExamInfo");

          const exam = await ExamInfo.findById(examId);
          const subjectName = exam ? exam.examName : "Online MCQ Exam";
          const currentYear = new Date().getFullYear().toString();

          const existingTopper = await Student.findOne({
            name: studentName,
            subject: subjectName,
            batch: currentYear,
          });

          if (!existingTopper) {
            const counter = await StudentCounter.findByIdAndUpdate(
              "studentId",
              { $inc: { seq: 1 } },
              { new: true, upsert: true }
            );

            await Student.create({
              id: counter.seq,
              name: studentName,
              subject: subjectName,
              batch: currentYear,
              totalMark: totalPossibleScore,
              gainMark: score,
              image: "",
              examId: examId,
              attemptId: attempt._id,
            });
          }
        } catch (topperErr) {
          console.error("Failed to auto-save topper student:", topperErr);
        }
      }
    }

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

module.exports = router;
