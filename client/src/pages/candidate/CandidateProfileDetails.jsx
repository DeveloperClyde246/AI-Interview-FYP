import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!candidate) return <p>Loading...</p>;

  return (
    <div>
      <CandidateNavbar />
      <h2>My Profile</h2>

      <p><strong>Name:</strong> {candidate.name}</p>
      <p><strong>Email:</strong> {candidate.email}</p>
      <p><strong>Contact Number:</strong> {candidate.contactNumber || "Not provided"}</p>
      <p><strong>Role Applied:</strong> {candidate.roleApplied || "Not specified"}</p>
      <p><strong>Introduction:</strong> {candidate.introduction || "No introduction provided."}</p>

      <div>
        <strong>Skills:</strong>
        {candidate.skills && candidate.skills.length > 0 ? (
          <ul>
            {candidate.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills listed.</p>
        )}
      </div>

      <div>
        <strong>Education:</strong>
        {candidate.education && candidate.education.length > 0 ? (
          <ul>
            {candidate.education.map((edu, idx) => (
              <li key={idx}>
                {edu.degree} from {edu.institution}  ({edu.yearOfCompletion} years)
              </li>
            ))}
          </ul>
        ) : (
          <p>No education details provided.</p>
        )}
      </div>

      <button onClick={() => navigate("/candidate/profile/edit")}>
        Edit Profile
      </button>

      <br />
      <button onClick={() => navigate("/candidate/profile/change-password")}>Change Password</button>

      <br />
      <button onClick={() => navigate("/candidate")}>Back to Dashboard</button>
    </div>
  );
};

export default CandidateProfileDetails;
