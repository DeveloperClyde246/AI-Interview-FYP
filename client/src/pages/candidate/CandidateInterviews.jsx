import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateInterviews.css";

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch assigned interviews on load
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/candidate/interviews", {
          withCredentials: true,
        });
        setInterviews(res.data.interviews);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching interviews:", error.message);
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <p>Loading interviews...</p>;
  }

  return (
    <div className="container">
      <CandidateNavbar />
      <h2>My Interviews</h2>
      
      <div className="interview-cards">
        {interviews.length === 0 ? (
          <p>No assigned interviews</p>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="interview-card"
              onClick={() => navigate(`/candidate/interview-details/${interview._id}`)}
            >
              <h3>{interview.title}</h3>
              <p>
                <strong>Recruiter:</strong> {interview.recruiterId.name} (
                {interview.recruiterId.email})
              </p>
              <p>
                <strong>Scheduled Date:</strong>{" "}
                {new Date(interview.scheduled_date).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {interview.status === "submitted" && (
                  <span className="status submitted">Submitted</span>
                )}
                {interview.status === "submitted late" && (
                  <span className="status submitted-late">Submitted Late</span>
                )}
                {interview.status === "pending" && (
                  <span className="status pending">Pending</span>
                )}
              </p>
              <div className="results">
                {interview.alreadySubmitted ? (
                  <Link to={`/candidate/interview/${interview._id}/results`}>
                    View Results
                  </Link>
                ) : (
                  "-"
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <Link to="/candidate" className="back-link">
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default CandidateInterviews;
