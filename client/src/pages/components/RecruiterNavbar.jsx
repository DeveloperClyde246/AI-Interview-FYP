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

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#82fadc",
      borderBottom: "1px solid #ccc",
      marginBottom: "20px",
    },
    navLink: {
      textDecoration: "none",
      color: "#0a00bf",
      fontWeight: "bold",
    },
    logoutButton: {
      backgroundColor: "#343835",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/recruiter" style={styles.navLink}>Dashboard</Link>
      <Link to="/recruiter/interviews" style={styles.navLink}>Interviews</Link>
      <Link to="/recruiter/interview-results" style={styles.navLink}>Results</Link>
      <Link to="/recruiter/create-interview" style={styles.navLink}>Create Interview</Link>
      <Link to="/recruiter/profile" style={styles.navLink}>My Profile</Link>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </nav>
  );
};

export default RecruiterNavbar;
