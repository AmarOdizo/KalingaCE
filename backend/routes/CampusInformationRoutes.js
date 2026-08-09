const express = require("express");
const router = express.Router();

const CampusInformation = require("../models/CampusInformation");

/* ==========================================
   GET ALL CAMPUS INFORMATION
========================================== */
router.get("/", async (req, res) => {
  try {
    const campus = await CampusInformation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campus.length,
      data: campus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==========================================
   GET SINGLE CAMPUS INFORMATION
========================================== */
router.get("/:id", async (req, res) => {
  try {
    const campus = await CampusInformation.findById(req.params.id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus information not found",
      });
    }

    res.status(200).json({
      success: true,
      data: campus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==========================================
   CREATE CAMPUS INFORMATION
========================================== */
router.post("/", async (req, res) => {
  try {
    const campus = await CampusInformation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Campus information created successfully",
      data: campus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==========================================
   UPDATE CAMPUS INFORMATION
========================================== */
router.put("/:id", async (req, res) => {
  try {
    const campus = await CampusInformation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus information not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campus information updated successfully",
      data: campus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==========================================
   DELETE CAMPUS INFORMATION
========================================== */
router.delete("/:id", async (req, res) => {
  try {
    const campus = await CampusInformation.findByIdAndDelete(req.params.id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus information not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campus information deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
