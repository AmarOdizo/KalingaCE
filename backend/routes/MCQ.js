const express = require("express");
const router = express.Router();

const MCQ = require("../models/MCQ");
const MCQCounter = require("../models/MCQCounter");

// =====================================================
// GET ALL MCQs
// =====================================================

router.get("/", async (req, res) => {
  try {
    const mcqs = await MCQ.find().sort({ id: 1 }).populate("examId");

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
    }).populate("examId");

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
    }).sort({ id: 1 }).populate("examId");

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
      examId,
      subject,
      question,
      options,
      correctAnswer,
      marks,
      explanation,
    } = req.body;

    // -----------------------------
    // Required validation
    // -----------------------------

    if (!examId || !subject || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Exam ID, subject, question, options and correctAnswer are required",
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
      examId,
      subject: subject.trim(),
      question: question.trim(),
      options,
      correctAnswer: correctAnswer.trim(),
      marks: marks || 1,
      explanation: explanation || "",
    });

    const populatedMCQ = await MCQ.findById(mcq._id).populate("examId");

    res.status(201).json({
      success: true,
      message: "MCQ created successfully",
      data: populatedMCQ,
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
      examId,
      subject,
      question,
      options,
      correctAnswer,
      marks,
      explanation,
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

    existingMCQ.examId = examId || existingMCQ.examId;
    existingMCQ.subject = subject?.trim() || existingMCQ.subject;
    existingMCQ.question = question?.trim() || existingMCQ.question;
    existingMCQ.options = finalOptions;
    existingMCQ.correctAnswer = finalCorrectAnswer;
    existingMCQ.marks = marks ?? existingMCQ.marks;
    existingMCQ.explanation = explanation ?? existingMCQ.explanation;

    await existingMCQ.save();
    const populatedMCQ = await MCQ.findById(existingMCQ._id).populate("examId");

    res.status(200).json({
      success: true,
      message: "MCQ updated successfully",
      data: populatedMCQ,
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

// GET MCQs BY EXAM SCHEDULE (examId)
// =====================================================

router.get("/exam/:examId", async (req, res) => {
  try {
    const examId = req.params.examId;

    const mcqs = await MCQ.find({
      examId,
    }).sort({ id: 1 }).populate("examId");

    res.status(200).json({
      success: true,
      count: mcqs.length,
      data: mcqs,
    });
  } catch (error) {
    console.error("GET EXAM MCQS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam MCQs",
      error: error.message,
    });
  }
});

// =====================================================
// BULK CREATE MCQS
// =====================================================
router.post("/bulk", async (req, res) => {
  try {
    const { mcqs } = req.body;

    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of MCQs is required",
      });
    }

    // Validate all items
    for (const item of mcqs) {
      if (!item.examId || !item.subject || !item.question || !item.options || !item.correctAnswer) {
        return res.status(400).json({
          success: false,
          message: "All MCQs must contain examId, subject, question, options and correctAnswer",
        });
      }
      if (!Array.isArray(item.options) || item.options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: "Each MCQ must have exactly 4 options",
        });
      }
      if (!item.options.includes(item.correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: "Correct answer must match one of the options",
        });
      }
    }

    // Fetch counter to increment sequence safely
    const counter = await MCQCounter.findOneAndUpdate(
      { _id: "mcqId" },
      { $inc: { seq: mcqs.length } },
      { new: true, upsert: true }
    );

    const startSeq = counter.seq - mcqs.length;

    const mcqsToInsert = mcqs.map((item, index) => ({
      id: startSeq + index + 1,
      examId: item.examId,
      subject: item.subject.trim(),
      question: item.question.trim(),
      options: item.options.map(opt => opt.trim()),
      correctAnswer: item.correctAnswer.trim(),
      marks: Number(item.marks) || 1,
      explanation: item.explanation?.trim() || "",
    }));

    const result = await MCQ.insertMany(mcqsToInsert);

    res.status(201).json({
      success: true,
      message: `${result.length} MCQs published successfully`,
      data: result,
    });
  } catch (error) {
    console.error("BULK CREATE MCQ ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk create MCQs",
      error: error.message,
    });
  }
});

module.exports = router;
