import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
    <div>
      <h2>Change User Password</h2>

      <form onSubmit={handleChangePassword}>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Change Password</button>
      </form>

      <br />
      <button onClick={() => navigate("/admin")}>← Back</button>
    </div>
  );
};

export default AdminChangePassword;
