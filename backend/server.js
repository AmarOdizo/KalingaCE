require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/Student", require("./routes/studentRoutes"));
app.use("/api/ExamInfo", require("./routes/examInfoRoutes"));
app.use("/api/Note", require("./routes/noteRoutes"));
app.use("/api/Course", require("./routes/courseRoutes"));
app.use("/api/Poster", require("./routes/posterRoutes"));
app.use("/api/CampusInformation", require("./routes/CampusInformationRoutes"));
app.use("/api/EnrolledStudent", require("./routes/EnrolledStudentRoutes"));
app.use("/api/Contact1", require("./routes/Contact1Routes"));
app.use("/api/Admin", require("./routes/AdminRoutes"));

// Home Route
app.get("/api", (req, res) => {
  res.send("🚀 Backend Running Successfully...");
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
