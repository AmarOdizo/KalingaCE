const imagekit = require("../config/imagekit");

exports.uploadStudentImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + "-" + req.file.originalname,
      folder: "/Student",
    });

    res.status(200).json({
      success: true,
      message: "Image Uploaded Successfully",
      imageUrl: result.url,
      fileId: result.fileId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
