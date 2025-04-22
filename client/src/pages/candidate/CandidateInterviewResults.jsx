import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateInterviewResults.css";

const CandidateInterviewResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/candidate/interview/${id}/results`, {
          withCredentials: true,
        });
        setResult(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Error loading results");
      }
    };

    fetchResults();
  }, [id]);

  if (!result) return <p className="loading">Loading...</p>;

  return (
    <div className="results-container">
      <CandidateNavbar />
      <div className="results-card">
        <h2>Interview Results - {result.title}</h2>
        <div className="detail-group">
          <p>
            <strong>Recruiter:</strong> {result.recruiter.name} ({result.recruiter.email})
          </p>
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Submitted At:</strong> {new Date(result.submitDateTime).toLocaleString()}
          </p>
        </div>

        <div className="question-section">
          <h3>Questions & Your Answers</h3>
          {result.questions.map((q, index) => (
            <div key={index} className="question-block">
              <p className="question-text">
                <strong>Q{index + 1}:</strong> {q.questionText}
              </p>
              <p className="answer-text">
                <strong>Your Answer:</strong>{" "}
                {result.answers[index]?.startsWith("http") ? (
                  <a href={result.answers[index]} target="_blank" rel="noreferrer">
                    View File
                  </a>
                ) : (
                  result.answers[index]
                )}
              </p>
              {result.videoMarks && result.videoMarks[index] != null && (
                <p className="mark-text">
                  <strong>Mark:</strong> {result.videoMarks[index]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="summary">
          <h3>Average Mark: {result.averageMark ?? "Pending"}</h3>
        </div>

        <div className="action-group">
          <button onClick={() => navigate("/candidate/interviews")} className="back-btn">
            ← Back to My Interviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateInterviewResults;
