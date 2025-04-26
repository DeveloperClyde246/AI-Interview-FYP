const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  candidate:     { type: Schema.Types.ObjectId, ref: "User" },
  answers:       [String],
  videoMarks:    [Number],
  marks:         { type: Number, default: null },
  status:        { type: String, enum: ["pending","submitted","submitted late"], default: "pending" },
  submitDateTime:{ type: Date },
  analysis: {                     // ← now an array of Mixed
    type: [Schema.Types.Mixed],
    default: []
  }
});