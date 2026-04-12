const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../configs/cloudinary");
const { extractTextFromPDF } = require("../utils/pdf");
const { generateQuestions, generateFinalFeedback } = require("../utils/gemini");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("1. File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });
    console.log("2. Uploaded to Cloudinary");

    const text = await extractTextFromPDF(req.file.path);
    console.log("3. Extracted text length:", text.length);

    const data = await generateQuestions(text);
    console.log("4. Gemini response received");

    fs.unlinkSync(req.file.path);

    res.json({
      message: "PDF uploaded & processed successfully ✅",
      url: result.secure_url,
      questions: data,
    });
  } catch (err) {
    console.log("ERROR:", err);

    // delete file if error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    res.status(500).json({ error: err.message });
  }
});
//  providing the feedback
router.post("/provide-feedback", async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ error: "Questions and answers required" });
    }

    const feedback = await generateFinalFeedback(questions, answers);

    res.json({
      message: "Final feedback generated",
      feedback,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
