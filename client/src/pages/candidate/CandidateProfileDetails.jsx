import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateProfileDetails.css";

const CandidateProfileDetails = () => {
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/candidate/profile", {
          withCredentials: true,
        });

        if (res.data.candidate) {
          setCandidate(res.data.candidate);
        }
      } catch (err) {
        console.error("Error fetching candidate profile:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!candidate) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">
      <CandidateNavbar />
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-detail">
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Contact Number:</strong> {candidate.contactNumber || "Not provided"}
          </p>
          <p>
            <strong>Role Applied:</strong> {candidate.roleApplied || "Not specified"}
          </p>
          <p>
            <strong>Introduction:</strong> {candidate.introduction || "No introduction provided."}
          </p>
        </div>

        <div className="profile-section">
          <strong>Skills:</strong>
          {candidate.skills && candidate.skills.length > 0 ? (
            <ul className="profile-list">
              {candidate.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )}
        </div>

        <div className="profile-section">
          <strong>Education:</strong>
          {candidate.education && candidate.education.length > 0 ? (
            <ul className="profile-list">
              {candidate.education.map((edu, idx) => (
                <li key={idx}>
                  {edu.degree} from {edu.institution} ({edu.yearOfCompletion} years)
                </li>
              ))}
            </ul>
          ) : (
            <p>No education details provided.</p>
          )}
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/candidate/profile/edit")}>Edit Profile</button>
          <button onClick={() => navigate("/candidate/profile/change-password")}>
            Change Password
          </button>
          <button onClick={() => navigate("/candidate")}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileDetails;
