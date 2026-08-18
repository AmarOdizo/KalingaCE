require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// ===============================
// Database Connection
// ===============================
connectDB();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Routes
// ===============================
app.use("/api/Student", require("./routes/StudentRoutes"));
app.use("/api/ExamInfo", require("./routes/ExamInfoRoutes"));
app.use("/api/Note", require("./routes/NoteRoutes"));
app.use("/api/Course", require("./routes/CourseRoutes"));
app.use("/api/Poster", require("./routes/PosterRoutes"));
app.use("/api/CampusInformation", require("./routes/CampusInformationRoutes"));
app.use("/api/EnrolledStudent", require("./routes/EnrolledStudentRoutes"));
app.use("/api/Contact1", require("./routes/Contact1Routes"));
app.use("/api/Admin", require("./routes/AdminRoutes"));
app.use("/api/MCQ", require("./routes/MCQ"));
app.use("/api/ExamAttempt", require("./routes/ExamAttemptRoutes"));

// otp routes
app.use("/api/otp", require("./routes/otp"));

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Backend Running Successfully...",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Running Successfully...",
  });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
