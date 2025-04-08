const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
const Interview = require("../models/Interview");
const User = require("../models/User");
const Candidate = require("../models/candidate");
const Recruiter = require("../models/Recruiter"); 
const mongoose = require("mongoose");

const router = express.Router();

// Ensure only recruiters can access these routes
router.use(authMiddleware(["recruiter"]));


//---------------Dashboard page------------------//
// ✅ Recruiter Dashboard (GET all notifications + interviews)
//Recruiter Dashboard Route
router.get("/", async (req, res) => {
  try {
    console.log("📥 Recruiter dashboard accessed");
    const recruiterId = req.user.id;
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours ahead

    const upcomingInterviews = await Interview.find({
      recruiterId,
      scheduled_date: { $gte: now, $lte: nextDay },
    }).populate("candidates", "_id");

    for (const interview of upcomingInterviews) {
      const formattedDate = new Date(interview.scheduled_date).toLocaleString();
      const recruiterMsg = `You have an interview titled "${interview.title}" scheduled for ${formattedDate}.`;

      // Create notification with interviewDate
      const recruiterNotification = await Notification.findOne({
        userId: recruiterId,
        message: recruiterMsg,
      });

      if (!recruiterNotification) {
        await Notification.create({
          userId: recruiterId,
          message: recruiterMsg,
          status: "unread",
          interviewDate: interview.scheduled_date,
        });
      }

      for (const candidate of interview.candidates) {
        const candidateMsg = `You have an interview titled "${interview.title}" scheduled for ${formattedDate}.`;

        const existing = await Notification.findOne({
          userId: candidate._id,
          message: candidateMsg,
        });

        if (!existing) {
          await Notification.create({
            userId: candidate._id,
            message: candidateMsg,
            status: "unread",
            interviewDate: interview.scheduled_date,
          });
        }
      }
    }

    const notifications = await Notification.find({ userId: recruiterId }).sort({
      createdAt: -1,
    });

    const interviews = await Interview.find({ recruiterId })
      .populate("candidates", "name email")
      .sort({ scheduled_date: -1 });

    res.json({
      username: req.cookies.username,
      notifications,
      interviews,
    });
  } catch (error) {
    console.error("❌ Error loading recruiter dashboard:", error.message);
    res.status(500).json({ message: "Error loading dashboard" });
  }
});

// Get Notification Details
router.get("/notifications/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

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


//Create Interview pages
// ✅ Fetch candidates for create-interview page
router.get("/create-interview", async (req, res) => {
  try {
    const users = await User.find({ role: "candidate" });
    res.json({ candidates: users });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Error loading users" });
  }
});

// ✅ Create new interview
router.post("/create-interview", async (req, res) => {
  const { title, description, scheduled_date, questions, answerDuration, candidateIds } = req.body;
  const recruiterId = req.user.id;

  try {
    // ✅ Validate if questions is an array of objects
    if (!Array.isArray(questions) || questions.some(q => typeof q !== "object" || !q.questionText)) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    // ✅ Map questions correctly
    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      answerType: q.answerType || "text",
      recordingRequired: q.recordingRequired || false,
    }));

    console.log("Received Scheduled Date:", scheduled_date);
    console.log("Scheduled Date (Parsed):", new Date(scheduled_date));

    const parsedDate = new Date(scheduled_date);
    //const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000); 

    // ✅ Create new interview with formatted questions
    const interview = new Interview({
      recruiterId,
      title,
      description,
      scheduled_date: parsedDate,
      answerDuration: answerDuration || 60, 
      questions: formattedQuestions,
      candidates: candidateIds ? candidateIds.map((id) => new mongoose.Types.ObjectId(id)) : [],
    });

    await interview.save();
    res.status(201).json({ message: "Interview created successfully" });
  } catch (error) {
    console.error("❌ Error creating interview:", error.message);
    res.status(500).json({ message: "Error creating interview" });
  }
});

//---------------View interview pages------------------//
// ✅ Get all interviews for this recruiter
router.get("/interviews", async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const interviews = await Interview.find({ recruiterId })
      .populate("candidates", "name email")
      .sort({ scheduled_date: -1 });

    res.json({ interviews });
  } catch (error) {
    console.error("❌ Error loading interviews:", error.message);
    res.status(500).json({ message: "Error loading interviews" });
  }
});


//----------------Edit interview pages------------------//
// ✅ Get a single interview
router.get("/interview/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("candidates", "name email");
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const allCandidates = await User.find({ role: "candidate" });
    res.json({ interview, allCandidates });
  } catch (error) {
    console.error("❌ Error fetching interview details:", error.message);
    res.status(500).json({ message: "Error fetching interview details" });
  }
});

// ✅ Add candidates to interview
router.post("/interview/:id/add-candidates", async (req, res) => {
  try {
    const { candidateIds } = req.body;
    if (!candidateIds || candidateIds.length === 0) {
      return res.status(400).json({ message: "No candidates provided" });
    }

    await Interview.findByIdAndUpdate(req.params.id, {
      $addToSet: { candidates: { $each: candidateIds.map((id) => new mongoose.Types.ObjectId(id)) } },
    });

    res.json({ message: "Candidates added" });
  } catch (error) {
    console.error("❌ Error adding candidates:", error.message);
    res.status(500).json({ message: "Error adding candidates" });
  }
});

// ✅ Delete interview
router.post("/interview/:id/delete", async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: "Interview deleted" });
  } catch (error) {
    console.error("❌ Error deleting interview:", error.message);
    res.status(500).json({ message: "Error deleting interview" });
  }
});

// ✅ Unassign candidate
router.post("/interview/:id/unassign-candidate", async (req, res) => {
  try {
    const { candidateId } = req.body;
    await Interview.findByIdAndUpdate(req.params.id, {
      $pull: { candidates: new mongoose.Types.ObjectId(candidateId) },
    });

    res.json({ message: "Candidate unassigned" });
  } catch (error) {
    console.error("❌ Error unassigning candidate:", error.message);
    res.status(500).json({ message: "Error unassigning candidate" });
  }
});

// ✅ Edit interview (Questions, Title, Description, Date, and Duration)
router.post("/interview/:id/edit", async (req, res) => {
  try {
    const { title, description, scheduled_date, questions, answerTypes, answerDuration } = req.body;

    // ✅ Map questions correctly
    const formattedQuestions = questions.map((q, index) => ({
      questionText: q,
      answerType: answerTypes[index],
    }));

    // ✅ Update interview details with questions, title, description, date, and duration
    await Interview.findByIdAndUpdate(req.params.id, {
      title,
      description,
      scheduled_date: new Date(scheduled_date),
      answerDuration: answerDuration || 60, // Default to 60 seconds if not provided
      questions: formattedQuestions,
    });

    res.json({ message: "Interview updated" });
  } catch (error) {
    console.error("❌ Error updating interview:", error.message);
    res.status(500).json({ message: "Error updating interview" });
  }
});


//---------------view results pages------------------//
// ✅ View AI analysis results
router.get("/interview-results", async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const interviews = await Interview.find({ recruiterId })
      .populate("responses.candidate", "name email")
      .populate("candidates", "name email")
      .sort({ createdAt: -1 });

    res.json({ interviews });
  } catch (error) {
    console.error("❌ Error loading interview results:", error.message);
    res.status(500).json({ message: "Error loading results" });
  }
});


// ✅ View candidate profile + response details
router.get("/candidate-details/:interviewId/:candidateId", async (req, res) => {
  const { interviewId, candidateId } = req.params;

  try {
    const interview = await Interview.findById(interviewId)
      .populate("responses.candidate", "name email")
      .populate("candidates", "_id"); // we will fetch full candidate info separately

    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const response = interview.responses.find(
      (r) => r.candidate?._id.toString() === candidateId
    );

    // ✅ Find candidate document from Candidate model
    const candidateProfile = await Candidate.findOne({ userId: candidateId }).lean();
    const userProfile = await User.findById(candidateId).lean();

    if (!candidateProfile || !userProfile) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const fullCandidate = {
      ...userProfile,
      ...candidateProfile
    };

    res.json({
      candidate: fullCandidate,
      response: response || null,
    });
  } catch (error) {
    console.error("❌ Error fetching candidate details:", error.message);
    res.status(500).json({ message: "Error fetching candidate details" });
  }
});


// ✅ Delete candidate response for an interview
router.post("/interview/:interviewId/delete-response", async (req, res) => {
  try {
    const { candidateId } = req.body;

    await Interview.findByIdAndUpdate(req.params.interviewId, {
      $pull: { responses: { candidate: candidateId } },
    });

    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting response:", error.message);
    res.status(500).json({ message: "Error deleting response" });
  }
});

//---------------Profile------------------//
// ✅ Get Recruiter Profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recruiter = await Recruiter.findOne({ userId: req.user.id });

    if (!user || !recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json({ user, recruiter });
  } catch (error) {
    console.error("❌ Error loading recruiter profile:", error.message);
    res.status(500).json({ message: "Error loading recruiter profile" });
  }
});

// ✅ Edit Recruiter Profile
router.post("/profile/edit", async (req, res) => {
  const { name, email, contactNumber, jobTitle } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, { name, email });
    await Recruiter.findOneAndUpdate({ userId: req.user.id }, { contactNumber, jobTitle });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating recruiter profile:", error.message);
    res.status(500).json({ message: "Error updating profile" });
  }
});


module.exports = router;
