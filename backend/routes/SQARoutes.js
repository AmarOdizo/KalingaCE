const express = require("express");
const router = express.Router();

const SQA = require("../models/SQA");

// ==========================================
// 1. CREATE SQA / EXAM
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { title, questions, examId } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const sqa = await SQA.create({
      title,
      questions,
      examId,
    });

    res.status(201).json({
      success: true,
      message: "SQA created successfully",
      data: sqa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 2. GET ALL SQA
// ==========================================
router.get("/", async (req, res) => {
  try {
    const sqa = await SQA.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sqa.length,
      data: sqa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 3. GET SQA BY ID
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const sqa = await SQA.findById(req.params.id);

    if (!sqa) {
      return res.status(404).json({
        success: false,
        message: "SQA not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sqa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 3.5. GET SQA BY EXAM ID
// ==========================================
router.get("/exam/:examId", async (req, res) => {
  try {
    const sqa = await SQA.findOne({ examId: req.params.examId });

    res.status(200).json({
      success: true,
      data: sqa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 4. ADD STUDENT ANSWERS
// ==========================================
router.post("/:id/answer", async (req, res) => {
  try {
    const { questionId, studentAnswer, studentName, mobileNumber } = req.body;

    if (!questionId || !studentAnswer) {
      return res.status(400).json({
        success: false,
        message: "Question ID and student answer are required",
      });
    }

    const sqa = await SQA.findById(req.params.id);

    if (!sqa) {
      return res.status(404).json({
        success: false,
        message: "SQA not found",
      });
    }

    // Check question exists
    const question = sqa.questions.id(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Add student answer
    sqa.answers.push({
      questionId,
      studentName: studentName || "Anonymous Student",
      mobileNumber: mobileNumber || "",
      studentAnswer,
      checked: false,
      isCorrect: null,
      marks: 0,
    });

    await sqa.save();

    res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      data: sqa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 5. CHECK ANSWER - YES / NO + MARKS
// ==========================================
router.put("/:id/check-answer/:answerId", async (req, res) => {
  try {
    const { isCorrect, marks } = req.body;

    const sqa = await SQA.findById(req.params.id);

    if (!sqa) {
      return res.status(404).json({
        success: false,
        message: "SQA not found",
      });
    }

    // Find answer
    const answer = sqa.answers.id(req.params.answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Find related question
    const question = sqa.questions.id(answer.questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // YES
    if (isCorrect === true) {
      if (marks === undefined || marks === null) {
        return res.status(400).json({
          success: false,
          message: "Please enter marks",
        });
      }

      if (marks < 0 || marks > question.maxMarks) {
        return res.status(400).json({
          success: false,
          message: `Marks must be between 0 and ${question.maxMarks}`,
        });
      }

      answer.isCorrect = true;
      answer.marks = marks;
    }

    // NO
    else if (isCorrect === false) {
      answer.isCorrect = false;
      answer.marks = 0;
    } else {
      return res.status(400).json({
        success: false,
        message: "isCorrect must be true or false",
      });
    }

    answer.checked = true;

    await sqa.save();

    res.status(200).json({
      success: true,
      message: "Answer checked successfully",
      data: answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 6. UPDATE SQA
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { title, questions, examId } = req.body;

    const sqa = await SQA.findByIdAndUpdate(
      req.params.id,
      {
        title,
        questions,
        examId,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!sqa) {
      return res.status(404).json({
        success: false,
        message: "SQA not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SQA updated successfully",
      data: sqa,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 7. DELETE SQA
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const sqa = await SQA.findByIdAndDelete(req.params.id);

    if (!sqa) {
      return res.status(404).json({
        success: false,
        message: "SQA not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SQA deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
