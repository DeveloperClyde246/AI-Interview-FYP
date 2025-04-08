import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateChangePassword.css";

const CandidateChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/candidate/profile/edit-password",
        form,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSuccess("Password updated successfully!");
        setForm({ currentPassword: "", newPassword: "" });
        navigate("/candidate/profile");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        err.response?.data?.message || "Failed to change password. Try again."
      );
    }
  };

  return (
    <div>
      <CandidateNavbar />
      <div className="change-password-container">

      <div className="change-password-card">
        <h2>Change Password</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handlePasswordChange} className="change-password-form">
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn">
            Change Password
          </button>
        </form>
        <button onClick={() => navigate("/candidate/profile")} className="back-btn">
          Back to Profile
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default CandidateChangePassword;
