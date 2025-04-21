const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Interview = require("../models/Interview");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const axios = require("axios");
const Candidate = require("../models/candidate");

const router = express.Router();

//convert to mp4
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const FormData = require("form-data");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Ensure only candidates can access these routes
router.use(authMiddleware(["candidate"]));

//---------------dashbooard page------------------//
// ✅ Candidate Dashboard - Get notifications and interviews
router.get("/", async (req, res) => {
  try {
    const candidateId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch notifications for the candidate
    const notifications = await Notification.find({ userId: candidateId }).sort({
      createdAt: -1,
    });

    // Fetch interviews where the candidate is assigned
    const interviews = await Interview.find({ candidates: candidateId })
      .populate("recruiterId", "name email")
      .sort({ scheduled_date: -1 });

    res.json({ username: req.cookies.username, notifications, interviews });
  } catch (error) {
    console.error("❌ Error loading candidate dashboard:", error.message);
    res.status(500).json({ message: "Error loading dashboard" });
  }
});

// ✅ Get Notification Details
router.get("/notifications/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ notification });
  } catch (error) {
    console.error("❌ Error fetching notification details:", error.message);
    res.status(500).json({ message: "Error fetching notification details" });
  }
});

// Delete Notification
router.delete("/notifications/:id/delete", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    // If the notification relates to an interview, check the interviewDate.
    if (notification.interviewDate) {
      const interviewDate = new Date(notification.interviewDate);
      const now = new Date();
      const timeDiff = interviewDate - now;
      // If the interview is in the future and is within 24 hours, prevent deletion.
      if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
        return res.status(403).json({
          message:
            "You cannot delete this notification because the interview is happening within 24 hours.",
        });
      }
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error.message);
    res.status(500).json({ message: "Error deleting notification" });
  }
});


//---------------profile pages------------------//
// ✅ Get Candidate Profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const candidateProfile = await Candidate.findOne({ userId: req.user.id });

    res.json({
      candidate: {
        ...user.toObject(),
        ...candidateProfile?.toObject(),
      },
    });
  } catch (error) {
    console.error("❌ Error loading profile:", error.message);
    res.status(500).json({ message: "Error loading profile" });
  }
});

// ✅ Update Profile
router.post("/profile/edit", async (req, res) => {
  const {
    name,
    email,
    roleApplied,
    skills,
    introduction,
    education,
    contactNumber,
  } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, { name, email });

    let candidate = await Candidate.findOne({ userId: req.user.id });
    if (!candidate) {
      candidate = new Candidate({ userId: req.user.id });
    }

    candidate.roleApplied = roleApplied;
    candidate.skills = skills;
    candidate.introduction = introduction;
    candidate.education = education;
    candidate.contactNumber = contactNumber;

    await candidate.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Error updating profile" });
  }
});


// ✅ Update Candidate Password
router.post("/profile/edit-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const candidate = await User.findById(req.user.id);

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, candidate.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error.message);
    res.status(500).json({ message: "Error updating password" });
  }
});



//---------------answer pages------------------//
// ✅ Get Assigned Interviews
router.get("/interviews", async (req, res) => {
  try {
    const candidateId = new mongoose.Types.ObjectId(req.user.id);

    const interviews = await Interview.find({ candidates: candidateId })
      .populate("recruiterId", "name email")
      .sort({ scheduled_date: -1 });

    const interviewsWithStatus = interviews.map((interview) => {
      const response = interview.responses.find(
        (res) => res.candidate.toString() === candidateId.toString()
      );
    
      return {
        ...interview.toObject(),
        alreadySubmitted: !!response,
        status: response ? response.status : "pending"
      };
    });

    res.json({ interviews: interviewsWithStatus });
  } catch (error) {
    console.error("❌ Error fetching interviews:", error.message);
    res.status(500).json({ message: "Error fetching interviews" });
  }
});


// ✅ Get Interview Details and Status
router.get("/interview/:id", async (req, res) => {
  try {
    const candidateId = req.user.id;

    // ✅ Populate recruiter details
    const interview = await Interview.findById(req.params.id).populate("recruiterId", "name email");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // ✅ Find candidate response (if any)
    const response = interview.responses.find(
      (res) => res.candidate.toString() === candidateId
    );

    const status = response?.status || "pending";
    const submitDateTime = response?.submitDateTime || null;

    res.json({ interview, status, submitDateTime }); // ✅ Include submitDateTime
  } catch (error) {
    console.error("❌ Error fetching interview:", error.message);
    res.status(500).json({ message: "Error fetching interview" });
  }
});



// ✅ Get Interview Results
router.get("/interview/:id/results", async (req, res) => {
  try {
    const candidateId = req.user.id;
    const interview = await Interview.findById(req.params.id)
      .populate("recruiterId", "name email");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const response = interview.responses.find(
      (res) => res.candidate.toString() === candidateId
    );

    if (!response) {
      return res.status(404).json({ message: "You have not submitted this interview." });
    }

    res.json({
      title: interview.title,
      recruiter: interview.recruiterId,
      questions: interview.questions,
      answers: response.answers,
      videoMarks: response.videoMarks,
      averageMark: response.marks,
      submitDateTime: response.submitDateTime,
      status: response.status,
    });
  } catch (err) {
    console.error("❌ Error fetching result:", err.message);
    res.status(500).json({ message: "Error fetching result" });
  }
});


// ✅ Submit Interview Answers setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "interview_responses",
    resource_type: "auto",
    format: async (req, file) => file.mimetype.split("/")[1],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Allow up to 200MB file uploads
});

// ✅ Submit Interview Answers
router.post("/interview/:id/submit",
  upload.array("fileAnswers", 5),
  async (req, res) => {
    try {
      const candidateId = req.user.id;
      const interview   = await Interview.findById(req.params.id);
      if (!interview) return res.status(404).json({ message: "Interview not found" });

      // prevent double submit
      if (interview.responses.some(r => r.candidate.toString() === candidateId)) {
        return res.status(400).json({ message: "Please wait analysis to finish." });
      }

      // collect answers + video URLs
      const processedAnswers = [];
      const videoURLs        = [];

      for (let f of req.files || []) {
        processedAnswers.push(f.path);
      }
      for (let ans of req.body.answers || []) {
        processedAnswers.push(ans);
        if (ans.startsWith("http") && ans.includes("/upload/")) {
          // transform to mp4 URL on Cloudinary
          const mp4 = ans
            .replace("/upload/", "/upload/f_mp4/")
            .replace(/\.webm$/, ".mp4");
          videoURLs.push(mp4);
        }
      }

      // create a new sub‑document
      const submittedAt = new Date();
      const isLate      = submittedAt > interview.scheduled_date;
      interview.responses.push({
        candidate:      candidateId,
        answers:        processedAnswers,
        analysis:       [],          // ← AI results will go here
        marks:          null,
        status:         isLate ? "submitted late" : "submitted",
        submitDateTime: submittedAt
      });
      await interview.save();

      // prepare temp dir
      const tmpDir = path.join(__dirname, "../temp");
      fs.mkdirSync(tmpDir, { recursive: true });

      const analyses = [];

      // for each video URL run AI analysis
      for (let url of videoURLs) {
        try {
          // detect extension
          const { pathname } = new URL(url);
          const ext = path.extname(pathname) || ".mp4";
          const downloadPath = path.join(tmpDir, `${uuidv4()}${ext}`);

          // download
          const writer = fs.createWriteStream(downloadPath);
          const resp   = await axios.get(url, { responseType: "stream" });
          await new Promise((ok, no) => {
            resp.data.pipe(writer);
            writer.on("finish", ok);
            writer.on("error",  no);
          });

          // convert if not already mp4
          let mp4Path = downloadPath;
          if (ext.toLowerCase() !== ".mp4") {
            mp4Path = downloadPath.replace(ext, ".mp4");
            await new Promise((ok, no) => {
              ffmpeg(downloadPath)
                .output(mp4Path)
                .on("end", ok)
                .on("error", no)
                .run();
            });
          }

          // call your Flask AI endpoint
          const form = new FormData();
          form.append("file", fs.createReadStream(mp4Path));
          const aiRes = await axios.post(
            "http://localhost:5001/analyze",
            form,
            { headers: form.getHeaders(), timeout: 180_000 }
          );

          analyses.push(aiRes.data);

          // cleanup
          fs.unlinkSync(downloadPath);
          if (mp4Path !== downloadPath) fs.unlinkSync(mp4Path);
        }
        catch (err) {
          console.error("AI analysis failed for", url, err.message);
          analyses.push({ error: err.message });
        }
      }

      // write analyses back into the same sub‑doc and compute marks
      const resp = interview.responses.find(r => r.candidate.toString() === candidateId);
      resp.analysis = analyses;

      // average of analysis[].final_average_score, defaulting missing → 0
      const scores = analyses.map(a =>
        typeof a.final_average_score === "number" ? a.final_average_score : 0
      );
      if (scores.length) {
        const avgRaw = scores.reduce((sum, v) => sum + v, 0) / scores.length;
        // keep two decimals
        resp.marks = Number(avgRaw.toFixed(2));
      } else {
        resp.marks = null;
      }

      await interview.save();

      return res.json({ message: "Submitted & analyzed", marks: resp.marks, analyses });
    }
    catch (err) {
      console.error("❌ submit error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);


//---------------faq pages------------------//
// ✅ Get FAQ Details
router.get("/faq", (req, res) => {
  res.json({ message: "FAQ Page Loaded" });
});

module.exports = router;
