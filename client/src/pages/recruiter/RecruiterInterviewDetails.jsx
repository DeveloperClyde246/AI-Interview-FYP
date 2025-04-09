import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterInterviewViewDetails.css";

const RecruiterInterviewViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recruiter/interview/${id}`, {
          withCredentials: true,
        });
        setInterview(res.data.interview);
      } catch (err) {
        console.error("Failed to load interview:", err);
        setError("Failed to load interview details.");
      }
    };

    fetchInterview();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!interview) return <p className="loading">Loading interview details...</p>;

  return (
    <div className="container">
      <RecruiterNavbar />
      <div className="details-card">
        <h2>Interview Details</h2>
        
        <div className="detail-group">
          <p><strong>Title:</strong> {interview.title}</p>
          <p><strong>Description:</strong> {interview.description}</p>
          <p>
            <strong>Scheduled Date:</strong>{" "}
            {new Date(interview.scheduled_date).toLocaleString()}
          </p>
          <p><strong>Answer Duration:</strong> {interview.answerDuration} seconds</p>
        </div>

        <div className="detail-group">
          <h3>Questions</h3>
          <ol className="question-list">
            {interview.questions.map((q, i) => (
              <li key={i}>
                {q.questionText} <span className="answer-type">({q.answerType})</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="detail-group">
          <h3>Assigned Candidates</h3>
          {interview.candidates.length > 0 ? (
            <ul className="candidate-list">
              {interview.candidates.map((c) => (
                <li key={c._id}>
                  {c.name} ({c.email})
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidates assigned yet.</p>
          )}
        </div>

        <div className="button-group">
          <Link to={`/recruiter/interview/${id}/manage-candidates`}>
            <button className="action-btn">Manage Candidates</button>
          </Link>
          <Link to={`/recruiter/interview/${id}/edit-form`}>
            <button className="action-btn">Edit Interview Form</button>
          </Link>
        </div>

        <div className="back-link-container">
          <button onClick={() => navigate("/recruiter/interviews")} className="back-btn">
            ← Back to Interviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterInterviewViewDetails;
