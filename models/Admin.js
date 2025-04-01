const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

});

module.exports = mongoose.model("Admin", AdminSchema);
