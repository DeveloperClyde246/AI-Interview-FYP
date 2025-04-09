import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateEditProfile.css";

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
          setForm((prevForm) => ({
            ...prevForm,
            name: candidate.name,
            email: candidate.email,
            roleApplied: candidate.roleApplied || "",
            skills: candidate.skills || [],
            introduction: candidate.introduction || "",
            education:
              candidate.education?.length > 0
                ? candidate.education
                : [{ degree: "", institution: "", yearOfCompletion: "" }],
            contactNumber: candidate.contactNumber || "",
          }));
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
        navigate("/candidate/profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="edit-profile-container">
      <CandidateNavbar />
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleProfileUpdate} className="edit-profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input
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
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Role Applied:</label>
            <input
              name="roleApplied"
              value={form.roleApplied}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Introduction:</label>
            <textarea
              name="introduction"
              value={form.introduction}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group skills-group">
            <label>Skills:</label>
            {form.skills.map((skill, index) => (
              <input
                key={index}
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder={`Skill ${index + 1}`}
                className="form-input"
              />
            ))}
            <button type="button" onClick={addSkill} className="add-btn">
              + Add Skill
            </button>
          </div>

          <div className="form-group">
            <label>Education:</label>
            {form.education.map((edu, index) => (
              <div key={index} className="education-group">
                <input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                  required
                  className="form-input education-input"
                />
                <input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                  required
                  className="form-input education-input"
                />
                <input
                  type="number"
                  placeholder="Year of Completion"
                  value={edu.yearOfCompletion}
                  onChange={(e) => handleEducationChange(index, "yearOfCompletion", e.target.value)}
                  required
                  className="form-input education-input"
                />
                {form.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedEducation = [...form.education];
                      updatedEducation.splice(index, 1);
                      setForm({ ...form, education: updatedEducation });
                    }}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addEducation} className="add-btn">
              + Add Education
            </button>
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn">
              Update Profile
            </button>
          </div>
        </form>

        <button onClick={() => navigate("/candidate/profile")} className="back-btn">
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default CandidateEditProfile;
