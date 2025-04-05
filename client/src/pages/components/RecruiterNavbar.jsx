import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/logout", {
        withCredentials: true,
      });

      if (res.status === 200) {
        alert("Logout successful!");
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
      <Link to="/recruiter" style={{ marginRight: "10px" }}>Dashboard</Link>
      <Link to="/recruiter/interviews" style={{ marginRight: "10px" }}>Interviews</Link>
      <Link to="/recruiter/interview-results" style={{ marginRight: "10px" }}>Results</Link>
      <Link to="/recruiter/create-interview" style={{ marginRight: "10px" }}>Create Interview</Link>
      <Link to="/recruiter/profile" style={{ marginRight: "10px" }}>My Profile</Link>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
    </nav>
  );
};

export default RecruiterNavbar;
