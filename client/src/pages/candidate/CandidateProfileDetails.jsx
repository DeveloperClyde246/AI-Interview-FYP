import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {candidate.name}</p>
      <p><strong>Email:</strong> {candidate.email}</p>

      <button onClick={() => navigate("/candidate/profile/edit")}>
        Edit Profile
      </button>

      <br />
      <button onClick={() => navigate("/candidate")}>Back to Dashboard</button>
    </div>
  );
};

export default CandidateProfileDetails;
