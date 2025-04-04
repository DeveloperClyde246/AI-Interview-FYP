import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateEditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    roleApplied: "",
    skills: [],
    introduction: "",
    education: [{ degree: "", institution: "", yearOfCompletion: "" }],
    contactNumber: "",
    currentPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/candidate/profile", {
          withCredentials: true,
        });

        if (res.data.candidate) {
          const candidate = res.data.candidate;
          setForm({
            ...form,
            name: candidate.name,
            email: candidate.email,
            roleApplied: candidate.roleApplied || "",
            skills: candidate.skills || [],
            introduction: candidate.introduction || "",
            education: candidate.education?.length > 0
              ? candidate.education
              : [{ degree: "", institution: "", yearOfCompletion: "" }],
            contactNumber: candidate.contactNumber || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...form.skills];
    updatedSkills[index] = value;
    setForm({ ...form, skills: updatedSkills });
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...form.education];
    updated[index][field] = value;
    setForm({ ...form, education: updated });
  };

  const addSkill = () => {
    setForm({ ...form, skills: [...form.skills, ""] });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { degree: "", institution: "", yearOfCompletion: "" }],
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/candidate/profile/edit",
        form,
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

  return (
    <div>
      <h2>Edit Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleProfileUpdate}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required /><br />

        <label>Email:</label>
        <input name="email" value={form.email} onChange={handleChange} required /><br />

        <label>Contact Number:</label>
        <input name="contactNumber" value={form.contactNumber} onChange={handleChange} required /><br />

        <label>Role Applied:</label>
        <input name="roleApplied" value={form.roleApplied} onChange={handleChange} /><br />

        <label>Introduction:</label><br />
        <textarea name="introduction" value={form.introduction} onChange={handleChange} /><br />

        <label>Skills:</label>
        {form.skills.map((skill, index) => (
          <input
            key={index}
            value={skill}
            onChange={(e) => handleSkillChange(index, e.target.value)}
            placeholder={`Skill ${index + 1}`}
          />
        ))}
        <button type="button" onClick={addSkill}>+ Add Skill</button><br /><br />

        <label>Education:</label>
        {form.education.map((edu, index) => (
          <div key={index}>
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
              required
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Year of Completion"
              value={edu.yearOfCompletion}
              onChange={(e) => handleEducationChange(index, "yearOfCompletion", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addEducation}>+ Add Education</button><br />

        <button type="submit">Update Profile</button>
      </form>

      <h3>Change Password</h3>
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
      <button onClick={() => navigate("/candidate")}>Back to Dashboard</button>
    </div>
  );
};

export default CandidateEditProfile;
