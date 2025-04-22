import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateInterviewDetails.css";

const CandidateInterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [status, setStatus] = useState("");
  const [submitDateTime, setSubmitDateTime] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/candidate/interview/${id}`, {
          withCredentials: true,
        });
        setInterview(res.data.interview);
        setStatus(res.data.status || "pending");
        setSubmitDateTime(res.data.submitDateTime || null);
      } catch (err) {
        console.error("Error fetching interview:", err);
        alert("Failed to load interview details.");
      }
    };

    fetchInterview();
  }, [id]);

  if (!interview) return <p className="loading">Loading...</p>;

  return (
    <div className="container">
      <CandidateNavbar />
      <div className="details-card">
        <h2>Interview Details</h2>
        <div className="detail-group">
          <p>
            <strong>Title:</strong> {interview.title}
          </p>
          <p>
            <strong>Description:</strong> {interview.description}
          </p>
          <p>
            <strong>Scheduled:</strong> {new Date(interview.scheduled_date).toLocaleString()}
          </p>
          <p>
            <strong>Duration:</strong> {interview.answerDuration} minutes
          </p>
          <p>
            <strong>Recruiter:</strong> {interview.recruiterId?.name} ({interview.recruiterId?.email})
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
          {submitDateTime && (
            <p>
              <strong>Submitted At:</strong> {new Date(submitDateTime).toLocaleString()}
            </p>
          )}
        </div>

        <p className="notice">You are only allowed to answer the interview once.</p>

        {status === "pending" ? (
          <button
            className="action-btn"
            onClick={() => {
              const confirmStart = window.confirm(
                "Are you sure you want to start the interview now? The timer will begin immediately."
              );
              if (confirmStart) {
                navigate(`/candidate/interview/${interview._id}`);
              }
            }}
          >
            Start Answering
          </button>
        ) : (
          <p className="submitted-text">You have already submitted this interview.</p>
        )}

        <button className="back-btn" onClick={() => navigate("/candidate/interviews")}>
          ← Back to Interviews
        </button>
      </div>
    </div>
  );
};

export default CandidateInterviewDetails;
