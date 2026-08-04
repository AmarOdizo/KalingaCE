const imagekit = require("../config/imagekit");

// Upload File
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/notes",
      useUniqueFileName: true,
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.url,
        fileId: result.fileId,
        fileName: result.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get File Details
exports.getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await imagekit.getFileDetails(fileId);

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
