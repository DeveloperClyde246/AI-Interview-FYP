import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  if (!user || !recruiter) return <p>Loading...</p>;

  return (
    <div>
      <h2>Recruiter Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Contact Number:</strong> {recruiter.contactNumber}</p>
      <p><strong>Job Title:</strong> {recruiter.jobTitle}</p>
      <p><strong>Date of Joining:</strong> {new Date(recruiter.dateOfJoining).toLocaleDateString()}</p>

      <button onClick={() => navigate("/recruiter/profile/edit")}>Edit Profile</button>
      <br />
      <button onClick={() => navigate("/recruiter")}>Back to Dashboard</button>
    </div>
  );
};

export default RecruiterProfileDetails;
