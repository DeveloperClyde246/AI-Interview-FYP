// models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread"
  },
  // ← NEW field to store the related interview’s scheduled date
  interviewDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// If you ever want one notification per candidate/video, you could
// also make `interviewDate` required, but default:null is fine too.
module.exports = mongoose.model("Notification", NotificationSchema);
