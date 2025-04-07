import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AdminChangePassword.css";

const AdminChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/admin-dashboard/change-password/${id}`,
        { newPassword },
        { withCredentials: true }
      );
      if (res.status === 200) {
        alert("Password updated successfully!");
        setNewPassword("");
        navigate("/admin");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("❌ Failed to update password. Please try again.");
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2>Change User Password</h2>
        <form onSubmit={handleChangePassword} className="change-password-form">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <br />
          <br />
          <button type="submit" className="save-btn">
            Change Password
          </button>
        </form>
        <button onClick={() => navigate("/admin")} className="back-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default AdminChangePassword;
