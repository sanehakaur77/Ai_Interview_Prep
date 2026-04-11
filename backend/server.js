const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./configs/db");
dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
//  routes
const authRoutes = require("./routes/authroutes");
const resumeRoutes = require("./routes/resume.route");
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
