const imagekit = require("../config/imagekit");

// Upload Contact Image
const uploadContactImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `contact-${Date.now()}-${req.file.originalname}`,
      folder: "/contacts",
    });

    res.status(200).json({
      success: true,
      message: "Contact image uploaded successfully",
      data: {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
      },
    });
  } catch (error) {
    console.error("Contact Image Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadContactImage,
};
