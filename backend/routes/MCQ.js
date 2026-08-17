const express = require("express");
const router = express.Router();

const MCQ = require("../models/MCQ");
const MCQCounter = require("../models/MCQCounter");

// =====================================================
// GET ALL MCQs
// =====================================================

router.get("/", async (req, res) => {
  try {
    const mcqs = await MCQ.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: mcqs.length,
      data: mcqs,
    });
  } catch (error) {
    console.error("GET MCQs ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch MCQs",
      error: error.message,
    });
  }
});

// =====================================================
// GET SINGLE MCQ
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const mcq = await MCQ.findOne({
      id: Number(req.params.id),
    });

    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mcq,
    });
  } catch (error) {
    console.error("GET SINGLE MCQ ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch MCQ",
      error: error.message,
    });
  }
});

// =====================================================
// GET MCQs BY SUBJECT
// IMPORTANT: This route must come before /:id
// =====================================================

router.get("/subject/:subject", async (req, res) => {
  try {
    const subject = decodeURIComponent(req.params.subject);

    const mcqs = await MCQ.find({
      subject: {
        $regex: `^${subject}$`,
        $options: "i",
      },
      status: "Active",
    }).sort({ id: 1 });

    res.status(200).json({
      success: true,
      subject,
      count: mcqs.length,
      data: mcqs,
    });
  } catch (error) {
    console.error("GET SUBJECT MCQs ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subject MCQs",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL SUBJECTS
// =====================================================

router.get("/subjects/all", async (req, res) => {
  try {
    const subjects = await MCQ.distinct("subject");

    subjects.sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("GET SUBJECTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE MCQ
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      subject,
      question,
      options,
      correctAnswer,
      marks,
      explanation,
      status,
    } = req.body;

    // -----------------------------
    // Required validation
    // -----------------------------

    if (!subject || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Subject, question, options and correctAnswer are required",
      });
    }

    // -----------------------------
    // Options validation
    // -----------------------------

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Exactly 4 options are required",
      });
    }

    // -----------------------------
    // Correct answer validation
    // -----------------------------

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must match one of the options",
      });
    }

    // -----------------------------
    // Generate custom ID
    // -----------------------------

    const counter = await MCQCounter.findOneAndUpdate(
      { _id: "mcqId" },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      },
    );

    // -----------------------------
    // Create MCQ
    // -----------------------------

    const mcq = await MCQ.create({
      id: counter.seq,
      subject: subject.trim(),
      question: question.trim(),
      options,
      correctAnswer: correctAnswer.trim(),
      marks: marks || 1,
      explanation: explanation || "",
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "MCQ created successfully",
      data: mcq,
    });
  } catch (error) {
    console.error("CREATE MCQ ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create MCQ",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE MCQ
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const mcqId = Number(req.params.id);

    const {
      subject,
      question,
      options,
      correctAnswer,
      marks,
      explanation,
      status,
    } = req.body;

    const existingMCQ = await MCQ.findOne({
      id: mcqId,
    });

    if (!existingMCQ) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found",
      });
    }

    // -----------------------------
    // Validate options
    // -----------------------------

    if (options && (!Array.isArray(options) || options.length !== 4)) {
      return res.status(400).json({
        success: false,
        message: "Exactly 4 options are required",
      });
    }

    // -----------------------------
    // Validate correct answer
    // -----------------------------

    const finalOptions = options || existingMCQ.options;
    const finalCorrectAnswer = correctAnswer || existingMCQ.correctAnswer;

    if (!finalOptions.includes(finalCorrectAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must match one of the options",
      });
    }

    // -----------------------------
    // Update
    // -----------------------------

    existingMCQ.subject = subject?.trim() || existingMCQ.subject;
    existingMCQ.question = question?.trim() || existingMCQ.question;
    existingMCQ.options = finalOptions;
    existingMCQ.correctAnswer = finalCorrectAnswer;
    existingMCQ.marks = marks ?? existingMCQ.marks;
    existingMCQ.explanation = explanation ?? existingMCQ.explanation;
    existingMCQ.status = status || existingMCQ.status;

    await existingMCQ.save();

    res.status(200).json({
      success: true,
      message: "MCQ updated successfully",
      data: existingMCQ,
    });
  } catch (error) {
    console.error("UPDATE MCQ ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update MCQ",
      error: error.message,
    });
  }
});

// =====================================================
// DELETE MCQ
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const mcqId = Number(req.params.id);

    const mcq = await MCQ.findOneAndDelete({
      id: mcqId,
    });

    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "MCQ deleted successfully",
      data: mcq,
    });
  } catch (error) {
    console.error("DELETE MCQ ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete MCQ",
      error: error.message,
    });
  }
});

module.exports = router;
