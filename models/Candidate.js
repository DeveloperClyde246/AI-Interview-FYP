const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ref to User schema
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interview" }], // Ref to Interview schema
  roleApplied: {
    type: String, // roles applied
    default: [],
  },

  skills: {
    type: [String], // Array of skills
    default: [],
  },

  introduction: {
    type: String, // A brief description by the candidate
    default: "",
  },

  education: [
    {
      degree: { type: String, required: true }, // Degree name
      institution: { type: String, required: true }, // Institution name
      yearOfCompletion: { type: Number, required: true }, // Year of completion
    },
  ],

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

module.exports = mongoose.model("Candidate", CandidateSchema);
