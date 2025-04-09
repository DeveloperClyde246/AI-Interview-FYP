import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterEditProfile.css";

const RecruiterEditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
    contactNumber: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/recruiter/profile", {
          withCredentials: true,
        });
        setForm({
          name: res.data.user.name,
          email: res.data.user.email,
          jobTitle: res.data.recruiter.jobTitle,
          contactNumber: res.data.recruiter.contactNumber,
        });
      } catch (err) {
        console.error("Error loading recruiter profile:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/recruiter/profile/edit",
        form,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setSuccess("Profile updated successfully.");
      }
    } catch (err) {
      console.error("Error updating recruiter profile:", err);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="edit-profile-container">
      <RecruiterNavbar />
      <div className="edit-profile-card">
        <h2>Edit Recruiter Profile</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Job Title:</label>
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Update Profile
            </button>
            <button type="button" onClick={() => navigate("/recruiter/profile")} className="back-btn">
              Back to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterEditProfile;
