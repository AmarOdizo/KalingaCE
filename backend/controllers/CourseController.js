const imagekit = require("../config/imagekit");

// ==========================
// Upload Course Image
// ==========================
const uploadCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const file = await imagekit.upload({
      file: req.file.buffer,
      fileName: `course_${Date.now()}_${req.file.originalname}`,
      folder: "/courses",
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        url: file.url,
        fileId: file.fileId,
        name: file.name,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadCourseImage,
};
