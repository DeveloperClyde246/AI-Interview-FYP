const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  candidate: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [String],
  videoMarks: [Number],            // existing: individual marks
  marks: { type: Number, default: null }, // existing: average mark
  status: { type: String, enum: ["pending","submitted","submitted late"], default: "pending" },
  submitDateTime: { type: Date },
  analysis: {                       // ← NEW!
    type: Schema.Types.Mixed,
    default: null
    /* or, if you want one entry per video:
    type: [Schema.Types.Mixed],
    default: []
    */
  }
});

const InterviewSchema = new Schema({
  recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  scheduled_date: { type: Date, required: true },
  candidates: [{ type: Schema.Types.ObjectId, ref: "User" }],
  questions: [{
    questionText: String,
    answerType: { type: String, enum: ["text","recording"], required: true }
  }],
  responses: [ResponseSchema],    // use the sub‐schema here
  createdAt: { type: Date, default: Date.now },
  answerDuration: { type: Number, default: 60 }
});

module.exports = mongoose.model("Interview", InterviewSchema);