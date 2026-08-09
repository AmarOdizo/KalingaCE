const imagekit = require("../config/imagekit");

// Upload Poster Image
exports.uploadPoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/poster",
    });

    res.status(200).json({
      success: true,
      data: {
        url: uploadedImage.url,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
