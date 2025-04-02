import React from "react";
import axios from "axios";
import {  Link, useNavigate } from "react-router-dom";

const CandidateFAQ = () => {
    // ✅ Handle Logout
      const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/auth/logout",
          {},
          { withCredentials: true }
        );
  
        if (res.status === 200) {
          alert("Logout successful!");
          navigate("/login"); // ✅ Redirect to login after successful logout
        } else {
          alert("Logout failed. Please try again.");
        }
      } catch (err) {
        console.error("Error during logout:", err);
        alert("Error logging out. Please try again.");
      }
    };


  return (
    <div>
      <nav style={styles.navbar}>
        <Link to="/candidate" style={styles.navLink}>Dashboard</Link>
        <Link to="/candidate/interviews" style={styles.navLink}>Interviews</Link>
        <Link to="/candidate/faq" style={styles.navLink}>FAQ</Link>
        <Link to="/candidate/profile" style={styles.navLink}>Profile</Link>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </nav>

      <h2>Frequently Asked Questions (FAQ)</h2>

      <h3>1. How do I schedule an interview?</h3>
      <p>
        Interviews are scheduled by recruiters. You will receive a notification
        once an interview is assigned to you.
      </p>

      <h3>2. How do I upload my resume?</h3>
      <p>
        Go to your <Link to="/candidate/profile">profile page</Link> and use the
        "Upload Resume" button to upload a PDF file.
      </p>

      <h3>3. Can I update my profile information?</h3>
      <p>
        Yes! You can update your name and email in your{" "}
        <Link to="/candidate/profile">profile page</Link>.
      </p>

      <h3>4. How do I check my upcoming interviews?</h3>
      <p>
        Your scheduled interviews are listed in your{" "}
        <Link to="/candidate">dashboard</Link>. You will also receive
        notifications for upcoming interviews.
      </p>

      <h3>5. How can I delete my resume?</h3>
      <p>
        You can delete your resume from your{" "}
        <Link to="/candidate/profile">profile page</Link> using the "Delete
        Resume" button.
      </p>

      <h3>6. What happens if I miss an interview?</h3>
      <p>
        If you miss an interview, please contact the recruiter as soon as
        possible to reschedule.
      </p>

      <h3>7. How can I see my interview performance?</h3>
      <p>
        Your interview performance and feedback will be available on your
        dashboard after the interview is completed.
      </p>

      <Link to="/candidate">Back to Dashboard</Link>
    </div>
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


export default CandidateFAQ;
