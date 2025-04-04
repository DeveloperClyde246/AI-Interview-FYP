import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch current candidate profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/candidate/profile", {
          withCredentials: true,
        });
        if (res.data.candidate) {
          setForm({
            name: res.data.candidate.name,
            email: res.data.candidate.email,
            currentPassword: "",
            newPassword: "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/candidate/profile/edit",
        {
          name: form.name,
          email: form.email,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  // ✅ Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/candidate/profile/edit-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSuccess("Password updated successfully!");
        setForm({ ...form, currentPassword: "", newPassword: "" });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        err.response?.data?.message || "Failed to change password. Try again."
      );
    }
  };

  // ✅ Handle navigation back to candidate dashboard
  const handleBackToDashboard = () => {
    navigate("/candidate");
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* ✅ Profile Update Form */}
      <form onSubmit={handleProfileUpdate}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Update Profile</button>
      </form>

      <h3>Change Password</h3>
      {/* ✅ Change Password Form */}
      <form onSubmit={handlePasswordChange}>
        <label>Current Password:</label>
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <br />

        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Change Password</button>
      </form>

      <br />
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
};

export default CandidateProfile;
