import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        navigate("/candidate/profile")
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
      <h2>Change Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

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
      <button onClick={() => navigate("/candidate/profile")}>
        Back to Profile
      </button>
    </div>
  );
};

export default CandidateChangePassword;
