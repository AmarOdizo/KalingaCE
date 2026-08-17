require("dotenv").config();

const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

async function createService() {
  try {
    const service = await client.verify.v2.services.create({
      friendlyName: "Normal Phone OTP",
    });

    console.log("=================================");
    console.log("Twilio Verify Service Created");
    console.log("Service SID:", service.sid);
    console.log("Service Name:", service.friendlyName);
    console.log("=================================");
  } catch (error) {
    console.error("Twilio Error:", error.message);
  }
}

createService();
