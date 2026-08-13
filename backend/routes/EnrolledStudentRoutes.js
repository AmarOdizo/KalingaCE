const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const Contact = require("../models/Contact");
const ContactCounter = require("../models/ContactCounter");
const imagekit = require("../config/imagekit");

// ===============================
// GET ALL CONTACTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("courseName")
      .sort({ id: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE CONTACT
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({
      id: Number(req.params.id),
    }).populate("courseName");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
});

// create a new contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, image, courseName } = req.body;

    // Required fields check
    if (!name || !email || !phone || !courseName) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and courseName are required",
      });
    }

    // Generate Custom ID
    const counter = await ContactCounter.findByIdAndUpdate(
      "contact",
      {
        $inc: {
          seq: 1,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    // Create Contact
    const contact = await Contact.create({
      id: counter.seq,
      name,
      email,
      phone,
      courseName,
    });

    // Populate Course
    const populatedContact = await Contact.findOne({
      id: contact.id,
    }).populate("courseName");

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: populatedContact,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create contact",
      error: error.message,
    });
  }
});

// update a contact
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, image, courseName } = req.body;

    const contact = await Contact.findOne({
      id: Number(req.params.id),
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) contact.name = name;
    if (email !== undefined) contact.email = email;
    if (phone !== undefined) contact.phone = phone;

    if (courseName !== undefined) contact.courseName = courseName;

    await contact.save();

    const updatedContact = await Contact.findOne({
      id: contact.id,
    }).populate("courseName");

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Update Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error.message,
    });
  }
});

// delete a contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({
      id: Number(req.params.id),
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact.deleteOne({
      id: Number(req.params.id),
    });

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
});

// Upload Contact Image
router.post("/upload", upload.single("image"), async (req, res) => {
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
      folder: "/EnrolledStudent",
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
});

module.exports = router;
