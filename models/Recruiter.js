const mongoose = require("mongoose");

const RecruiterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ref to User schema

  dateOfJoining: {
    type: Date,
    default: Date.now, // Default to current date if not specified
  },

  jobTitle: {
    type: String,
    required: true, // Job title is required
  },

  contactNumber: {
    type: String,
    validate: {
      validator: function (v) {
        // Basic regex to validate phone number format (e.g., +60123456789)
        return /^\+?[0-9]{10,15}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid contact number!`,
    },
    required: [true, "Contact number is required"],
  },
});

module.exports = mongoose.model("Recruiter", RecruiterSchema);
