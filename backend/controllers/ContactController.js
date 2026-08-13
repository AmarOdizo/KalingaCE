const imagekit = require("../config/imagekit");

// Upload Contact Image
exports.uploadContactImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/contact",
    });

    res.status(200).json({
      success: true,
      message: "Image Uploaded Successfully",
      data: {
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
        name: uploadedImage.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
