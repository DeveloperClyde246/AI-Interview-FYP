import React from "react";
import axios from "axios";
import {  Link, useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";

const CandidateFAQ = () => {
  
  return (
    <div>
      <CandidateNavbar />

      <h2>Frequently Asked Questions (FAQ)</h2>

      <h3>1. How do I schedule an interview?</h3>
      <p>
        Interviews are scheduled by recruiters. You will be informed by the recruiter once an interview is assigned to you.
      </p>

      <h3>2. Can I update my profile information?</h3>
      <p>
        Yes! You can update your name and email in your{" "}
        <Link to="/candidate/profile">profile page</Link>.
      </p>

      <h3>3. How do I check my upcoming interviews?</h3>
      <p>
        Your scheduled interviews are listed in your{" "}
        <Link to="/candidate">dashboard</Link>. You will also receive
        notifications for upcoming interviews.
      </p>


      <h3>4. What happens if I miss an interview?</h3>
      <p>
        If you miss an interview, u can still answer the interview if it is available but you will be marked as "Submitted Late". Contact the recruiter for rescheduling options.
      </p>

      <h3>5. How can I see my interview performance?</h3>
      <p>
        Your interview performance will be available in the interviews list once the interview is completed.
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
