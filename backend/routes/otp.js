const express = require("express");
const router = express.Router();

const twilioClient = require("../config/twilio");

// ======================================
// SEND OTP
// ======================================
router.post("/send", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // India number
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      status: verification.status,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// ======================================
// VERIFY OTP
// ======================================
router.post("/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhone,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res.status(200).json({
        success: true,
        verified: true,
        message: "Phone verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      verified: false,
      message: "Invalid OTP",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      verified: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

module.exports = router;
