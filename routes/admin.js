const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const Candidate = require("../models/candidate");
const Recruiter = require("../models/Recruiter"); 
const Admin = require("../models/Admin");
const router = express.Router();
const Interview = require("../models/Interview");  

// ✅ Only allow admin users
router.use(authMiddleware(["admin"]));

// ✅ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // return all users as array
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ POST create new user
router.post("/create", async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    if (role === "candidate") {
      await Candidate.create({
        userId: user._id,
        roleApplied: "",
        skills: [],
        introduction: "",
        education: [],
        contactNumber: "+60123456789"
      });
    }

    if (role === "recruiter") {
      await Recruiter.create({
        userId: user._id,
        jobTitle: "Default Job Title",
        contactNumber: "+60123456789",
        // dateOfJoining is automatically set
      });
    }

    if (role === "admin") {
      await Admin.create({
        userId: user._id,
        isSuperAdmin: false, 
      });
    }


    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// ✅ POST edit user
router.post("/edit/:id", async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// ✅ POST delete user
router.post("/delete/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email === "mainAdmin@gmail.com") {
      return res.status(403).json({ message: "Cannot delete the main admin account" });
    }

    // If recruiter, delete all interviews created by them
    if (user.role === "recruiter") {
      await Interview.deleteMany({ recruiterId: user._id });
    }

    await User.findByIdAndDelete(user._id);
    res.status(200).json({ message: "User and associated interviews deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ✅ POST change password
router.post("/change-password/:id", async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});

module.exports = router;
