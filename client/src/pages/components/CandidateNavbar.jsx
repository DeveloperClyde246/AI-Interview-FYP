import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CandidateNavbar = () => {
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
    <nav style={styles.navbar}>
      <Link to="/candidate" style={styles.navLink}>Dashboard</Link>
      <Link to="/candidate/interviews" style={styles.navLink}>Interviews</Link>
      <Link to="/candidate/faq" style={styles.navLink}>FAQ</Link>
      <Link to="/candidate/profile" style={styles.navLink}>Profile</Link>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ccc",
    marginBottom: "20px",
  },
  navLink: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CandidateNavbar;
