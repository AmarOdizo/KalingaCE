const express = require("express");
const router = express.Router();

const Contact1 = require("../models/contact1");
const Contact1Counter = require("../models/Contact1Counter");

// ==========================================
// POST - Create Contact1
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, subject, description } = req.body;

    // Required fields
    if (!name || !phone || !email || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, email, subject and description are required",
      });
    }

    // Generate Custom ID
    const counter = await Contact1Counter.findByIdAndUpdate(
      "contact1",
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
    const contact = await Contact1.create({
      id: counter.seq,
      name,
      phone,
      email,
      subject,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create Contact1 Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create contact",
      error: error.message,
    });
  }
});

// ==========================================
// GET - All Contacts
// ==========================================
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact1.find().sort({
      id: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contact1 Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
});

// ==========================================
// GET - Single Contact
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact1.findOne({
      id: Number(req.params.id),
    });

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
    console.error("Get Single Contact1 Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
});

// ==========================================
// PUT - Update Contact
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, email, subject, description } = req.body;

    const contact = await Contact1.findOne({
      id: Number(req.params.id),
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    if (name !== undefined) {
      contact.name = name;
    }

    if (phone !== undefined) {
      contact.phone = phone;
    }

    if (email !== undefined) {
      contact.email = email;
    }

    if (subject !== undefined) {
      contact.subject = subject;
    }

    if (description !== undefined) {
      contact.description = description;
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update Contact1 Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE - Delete Contact
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact1.findOne({
      id: Number(req.params.id),
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact1.deleteOne({
      id: Number(req.params.id),
    });

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Delete Contact1 Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
});

module.exports = router;
