const express = require("express");
const router = express.Router();

const Poster = require("../models/Poster");
const PosterCounter = require("../models/PosterCounter");
const upload = require("../middleware/upload");
const imagekit = require("../config/imagekit");

// Sirf image upload controller
const { uploadPoster } = require("../controllers/PosterController");

// =======================================
// GET ALL POSTERS
// =======================================
router.get("/", async (req, res) => {
  try {
    const posters = await Poster.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posters.length,
      data: posters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================================
// GET POSTER BY ID
// =======================================
router.get("/:id", async (req, res) => {
  try {
    const poster = await Poster.findOne({ id: Number(req.params.id) });

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found",
      });
    }

    res.status(200).json({
      success: true,
      data: poster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================================
// IMAGE UPLOAD
// =======================================
router.post("/upload", upload.single("image"), uploadPoster);

// =======================================
// CREATE POSTER
// =======================================
router.post("/", async (req, res) => {
  try {
    const counter = await PosterCounter.findByIdAndUpdate(
      "posterId",
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      },
    );

    const poster = await Poster.create({
      id: counter.seq,
      image: req.body.image,
    });

    res.status(201).json({
      success: true,
      message: "Poster created successfully",
      data: poster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================================
// UPDATE POSTER
// =======================================
router.put("/:id", async (req, res) => {
  try {
    const poster = await Poster.findOne({ id: Number(req.params.id) });

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found",
      });
    }

    poster.image = req.body.image || poster.image;

    await poster.save();

    res.status(200).json({
      success: true,
      message: "Poster updated successfully",
      data: poster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================================
// DELETE POSTER
// =======================================
router.delete("/:id", async (req, res) => {
  try {
    const poster = await Poster.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Poster deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
