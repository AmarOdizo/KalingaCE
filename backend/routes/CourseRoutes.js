const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const upload = require("../middleware/upload");
const { uploadCourseImage } = require("../controllers/CourseController");
const CourseCounter = require("../models/CourseCounter");
const imagekit = require("../config/imagekit");

// ===============================
// GET All Courses
// ===============================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
});

// ===============================
// GET Course By ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findOne({
      id: Number(req.params.id),
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
});

// ===========================
// POST Create Course
// ===========================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      courseName,
      courseCode,
      shortDescription,
      fullDescription,
      duration,
      eligibility,
      fees,
      mode,
      certificate,
      trainer,
      rating,
      students,
      technologies,
      features,
      syllabus,
      batchTiming,
      seats,
      status,
      isActive,
    } = req.body;

    // Upload Image to ImageKit
    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `course_${Date.now()}_${req.file.originalname}`,
        folder: "/courses",
      });

      imageUrl = uploadedImage.url;
    }

    // Auto Increment ID
    const counter = await CourseCounter.findByIdAndUpdate(
      { _id: "courseId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    // Create Course
    const course = new Course({
      id: counter.seq,
      courseName,
      courseCode,
      image: imageUrl,
      shortDescription,
      fullDescription,
      duration,
      eligibility,
      fees,
      mode,
      certificate,
      trainer,
      rating,
      students,

      technologies: technologies ? JSON.parse(technologies) : [],

      features: features ? JSON.parse(features) : [],

      syllabus: syllabus ? JSON.parse(syllabus) : [],

      batchTiming,
      seats,
      status,
      isActive,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

// ===========================
// UPDATE Course
// ===========================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const course = await Course.findOne({
      id: Number(req.params.id),
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Image Upload (Optional)
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `course_${Date.now()}_${req.file.originalname}`,
        folder: "/courses",
      });

      course.image = uploadedImage.url;
    }

    // Update Fields
    course.courseName = req.body.courseName ?? course.courseName;

    course.courseCode = req.body.courseCode ?? course.courseCode;

    course.shortDescription =
      req.body.shortDescription ?? course.shortDescription;

    course.fullDescription = req.body.fullDescription ?? course.fullDescription;

    course.duration = req.body.duration ?? course.duration;

    course.eligibility = req.body.eligibility ?? course.eligibility;

    course.fees = req.body.fees ?? course.fees;

    course.mode = req.body.mode ?? course.mode;

    course.certificate = req.body.certificate ?? course.certificate;

    course.trainer = req.body.trainer ?? course.trainer;

    course.rating = req.body.rating ?? course.rating;

    course.students = req.body.students ?? course.students;

    if (req.body.technologies) {
      course.technologies = JSON.parse(req.body.technologies);
    }

    if (req.body.features) {
      course.features = JSON.parse(req.body.features);
    }

    if (req.body.syllabus) {
      course.syllabus = JSON.parse(req.body.syllabus);
    }

    course.batchTiming = req.body.batchTiming ?? course.batchTiming;

    course.seats = req.body.seats ?? course.seats;

    course.status = req.body.status ?? course.status;

    if (req.body.isActive !== undefined) {
      course.isActive = req.body.isActive;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

// ===========================
// DELETE Course
// ===========================
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findOne({
      id: Number(req.params.id),
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.deleteOne({ id: Number(req.params.id) });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
});

router.post("/upload", upload.single("image"), uploadCourseImage);

module.exports = router;
