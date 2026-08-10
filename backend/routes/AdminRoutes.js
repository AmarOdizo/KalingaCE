const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");

// =====================================================
// CREATE ADMIN
// POST /api/Admin
// =====================================================
router.post("/", async (req, res) => {
  try {
    const { id, name, phone, email, password, role, isActive } = req.body;

    if (!id || !name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "ID, name, phone, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check ID
    const existingId = await Admin.findOne({ id });

    if (existingId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID already exists",
      });
    }

    // Check phone/email
    const existingAdmin = await Admin.findOne({
      $or: [{ phone }, { email: email.toLowerCase() }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Phone or email already exists",
      });
    }

    const admin = new Admin({
      id,
      name,
      phone,
      email: email.toLowerCase(),
      password,
      role: role || "Admin",
      isActive: isActive !== undefined ? isActive : true,
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin.id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// ADMIN LOGIN
// Phone OR Email
// POST /api/Admin/login
// =====================================================
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone/email and password are required",
      });
    }

    const admin = await Admin.findOne({
      $or: [{ phone: login }, { email: login.toLowerCase() }],
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone/email or password",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone/email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: admin.id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL ADMINS
// GET /api/Admin
// =====================================================
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password -resetOtp -resetOtpExpiry")
      .sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    console.error("Get Admins Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE ADMIN
// GET /api/Admin/:id
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findOne({
      id: Number(req.params.id),
    }).select("-password -resetOtp -resetOtpExpiry");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get Admin Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// UPDATE ADMIN
// PUT /api/Admin/:id
// =====================================================
router.put("/:id", async (req, res) => {
  try {
    const admin = await Admin.findOne({
      id: Number(req.params.id),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const { name, phone, email, role, isActive, password } = req.body;

    // Check phone
    if (phone && phone !== admin.phone) {
      const existingPhone = await Admin.findOne({
        phone,
        id: { $ne: admin.id },
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists",
        });
      }

      admin.phone = phone;
    }

    // Check email
    if (email && email.toLowerCase() !== admin.email) {
      const existingEmail = await Admin.findOne({
        email: email.toLowerCase(),
        id: { $ne: admin.id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      admin.email = email.toLowerCase();
    }

    if (name !== undefined) {
      admin.name = name;
    }

    if (role !== undefined) {
      admin.role = role;
    }

    if (isActive !== undefined) {
      admin.isActive = isActive;
    }

    // Password update
    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      admin.password = password;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: {
        id: admin.id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update Admin Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// DELETE ADMIN
// DELETE /api/Admin/:id
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const admin = await Admin.findOne({
      id: Number(req.params.id),
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await Admin.deleteOne({
      id: Number(req.params.id),
    });

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// CHANGE PASSWORD
// PUT /api/Admin/change-password
// =====================================================
router.put("/change-password", async (req, res) => {
  try {
    const { login, oldPassword, newPassword } = req.body;

    if (!login || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Login, old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const admin = await Admin.findOne({
      $or: [{ phone: login }, { email: login.toLowerCase() }],
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await admin.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    admin.password = newPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// FORGOT PASSWORD - SEND OTP
// POST /api/Admin/forgot-password
// =====================================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { login } = req.body;

    if (!login) {
      return res.status(400).json({
        success: false,
        message: "Phone or email is required",
      });
    }

    const admin = await Admin.findOne({
      $or: [{ phone: login }, { email: login.toLowerCase() }],
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5 minutes expiry
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    admin.resetOtp = otp;
    admin.resetOtpExpiry = expiry;

    await admin.save();

    // TESTING ONLY
    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp: otp,
      expiresIn: "5 minutes",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// RESET PASSWORD
// POST /api/Admin/reset-password
// =====================================================
router.post("/reset-password", async (req, res) => {
  try {
    const { login, otp, newPassword } = req.body;

    if (!login || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Login, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const admin = await Admin.findOne({
      $or: [{ phone: login }, { email: login.toLowerCase() }],
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // OTP check
    if (!admin.resetOtp || admin.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Expiry check
    if (!admin.resetOtpExpiry || admin.resetOtpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // New password
    admin.password = newPassword;

    // Clear OTP
    admin.resetOtp = null;
    admin.resetOtpExpiry = null;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
