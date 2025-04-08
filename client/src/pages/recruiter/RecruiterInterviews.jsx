import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterInterviews.css";

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recruiter/interviews", {
        withCredentials: true,
      });
      setInterviews(res.data.interviews || []);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
      setError("Could not load interviews.");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent card navigation
    if (!window.confirm("Are you sure you want to delete this interview?")) return;

    try {
      await axios.post(
        `http://localhost:5000/recruiter/interview/${id}/delete`,
        {},
        { withCredentials: true }
      );
      fetchInterviews();
    } catch (err) {
      console.error("Failed to delete interview:", err);
      setError("Failed to delete interview.");
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="container">
      <RecruiterNavbar />
      <h2>My Interviews</h2>
      {error && <p className="error">{error}</p>}

      <div className="interview-cards">
        {interviews.length === 0 ? (
          <p>No scheduled interviews</p>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="interview-card"
              onClick={() => navigate(`/recruiter/interview/${interview._id}`)}
            >
              <h3>{interview.title}</h3>
              <p>
                <strong>Scheduled Date:</strong>{" "}
                {interview.scheduled_date
                  ? new Date(interview.scheduled_date).toLocaleString()
                  : "Not Scheduled"}
              </p>
              <div className="card-actions">
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(interview._id, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Link to="/recruiter/create-interview" className="create-link">
        Create New Interview
      </Link>
    </div>
  );
};

export default RecruiterInterviews;
