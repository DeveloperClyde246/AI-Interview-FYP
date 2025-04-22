import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterProfileDetails.css";

const RecruiterProfileDetails = () => {
  const [user, setUser] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/recruiter/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setRecruiter(res.data.recruiter);
      } catch (err) {
        console.error("Error loading recruiter profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user || !recruiter) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">
      <RecruiterNavbar />
      <div className="profile-card">
        <h2>Recruiter Profile</h2>
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Contact Number:</strong> {recruiter.contactNumber || "Not provided"}
          </p>
          <p>
            <strong>Job Title:</strong> {recruiter.jobTitle || "N/A"}
          </p>
          <p>
            <strong>Date of Joining:</strong>{" "}
            {new Date(recruiter.dateOfJoining).toLocaleDateString()}
          </p>
        </div>
        <div className="profile-buttons">
          <button className="action-btn" onClick={() => navigate("/recruiter/profile/edit")}>
            Edit Profile
          </button>
          <button className="action-btn" onClick={() => navigate("/recruiter")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfileDetails;
