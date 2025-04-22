import React from "react";
import { Link } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateFAQ.css";

const CandidateFAQ = () => {
  return (
    <div className="faq-container">
      <CandidateNavbar />
      <div className="faq-card">
        <h2>Frequently Asked Questions (FAQ)</h2>
        
        <div className="faq-item">
          <h3>1. How do I schedule an interview?</h3>
          <p>
            Interviews are scheduled by recruiters. You will be informed by the recruiter once an interview is assigned to you.
          </p>
        </div>
        
        <div className="faq-item">
          <h3>2. Can I update my profile information?</h3>
          <p>
            Yes! You can update your name and email in your <Link to="/candidate/profile" className="link">profile page</Link>.
          </p>
        </div>
        
        <div className="faq-item">
          <h3>3. How do I check my upcoming interviews?</h3>
          <p>
            Your scheduled interviews are listed in your <Link to="/candidate" className="link">dashboard</Link>. You will also receive notifications for upcoming interviews.
          </p>
        </div>
        
        <div className="faq-item">
          <h3>4. What happens if I miss an interview?</h3>
          <p>
            If you miss an interview, you can still answer it if it is available, but you will be marked as "Submitted Late". Contact your recruiter for rescheduling options.
          </p>
        </div>
        
        <div className="faq-item">
          <h3>5. How can I see my interview performance?</h3>
          <p>
            Your interview performance will be available in the interviews list once the interview is completed.
          </p>
        </div>
        
        <Link to="/candidate" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CandidateFAQ;
