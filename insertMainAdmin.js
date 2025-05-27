// const mongoose = require("mongoose");
// const Admin = require("./models/Admin"); 

// // Connect to MongoDB first
// mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Update the specific admin
// Admin.findByIdAndUpdate(
//   "67c8ad3052a8e6728abae245",
//   { isSuperAdmin: true },
//   { new: true }
// )
//   .then((updatedAdmin) => {
//     console.log("✅ Admin updated:", updatedAdmin);
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error("❌ Error updating admin:", err);
//     mongoose.disconnect();
//   });