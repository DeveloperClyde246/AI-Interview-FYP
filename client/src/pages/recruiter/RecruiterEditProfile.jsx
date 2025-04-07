import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";

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
      const res = await axios.post("http://localhost:5000/recruiter/profile/edit", form, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setSuccess("Profile updated successfully.");
      }
    } catch (err) {
      console.error("Error updating recruiter profile:", err);
      setError("Failed to update profile.");
    }
  };

  return (
    <div>
      <RecruiterNavbar />
      <h2>Edit Recruiter Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required /><br />

        <label>Email:</label>
        <input name="email" value={form.email} onChange={handleChange} required /><br />

        <label>Contact Number:</label>
        <input name="contactNumber" value={form.contactNumber} onChange={handleChange} required /><br />

        <label>Job Title:</label>
        <input name="jobTitle" value={form.jobTitle} onChange={handleChange} required /><br />

        <button type="submit">Update</button>
      </form>

      <br />
      <button onClick={() => navigate("/recruiter")}>Back to Dashboard</button>
    </div>
  );
};

export default RecruiterEditProfile;
