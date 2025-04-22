// src/pages/RecruiterInterviewResults.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterInterviewResults.css";

const RecruiterInterviewResults = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/recruiter/interview-results",
        { withCredentials: true }
      );
      setInterviews(res.data.interviews);
    } catch (err) {
      console.error("Error loading results:", err);
      setError("Failed to load interview results.");
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleDeleteResponse = async (interviewId, candidateId) => {
    if (!window.confirm("Are you sure you want to delete this response?")) {
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/recruiter/interview/${interviewId}/delete-response`,
        { candidateId },
        { withCredentials: true }
      );
      alert("Response deleted.");
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error deleting response.");
    }
  };

  return (
    <div className="results-container">
      <RecruiterNavbar />
      <h2 className="main-heading">Interview Analysis Results</h2>
      {error && <p className="error">{error}</p>}

      {interviews.length === 0 ? (
        <p className="no-results">No interviews found.</p>
      ) : (
        interviews.map((interview) => (
          <div key={interview._id} className="interview-card">
            <div className="interview-header">
              <h3>{interview.title}</h3>
              <p className="scheduled-date">
                {new Date(interview.scheduled_date).toLocaleString()}
              </p>
            </div>
            <p className="interview-description">{interview.description}</p>

            <h4 className="section-heading">All Candidates</h4>
            <div className="table-responsive">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Marks</th>
                    <th>Answers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interview.candidates.map((candidate) => {
                    // find the matching response (compare as strings)
                    const response = interview.responses.find(
                      (r) =>
                        r.candidate &&
                        r.candidate._id.toString() === candidate._id.toString()
                    );

                    // calculate per-video marks if analysis exists
                    const perVideoMarks =
                      response?.analysis?.map((a, i) =>
                        (a.final_average_score ?? a.marks ?? 0).toFixed(2)
                      ) || [];

                    return (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.email}</td>
                        <td>
                          {response
                            ? response.status === "submitted late"
                              ? "Submitted Late"
                              : "Submitted"
                            : "Pending"}
                        </td>

                        {/* ── Marks */}
                        <td>
                          {response ? (
                            response.analysis && response.analysis.length > 0 ? (
                              <>
                                <ul className="marks-list">
                                  {perVideoMarks.map((m, idx) => (
                                    <li key={idx}>
                                      Video {idx + 1}: {m}{" "}
                                      <small>marks</small>
                                    </li>
                                  ))}
                                </ul>
                                <strong className="average-mark">
                                  Avg:{" "}
                                  {response.marks != null
                                    ? response.marks.toFixed(2)
                                    : "N/A"}{" "}
                                  marks
                                </strong>
                              </>
                            ) : (
                              <em>No marks yet</em>
                            )
                          ) : (
                            <em>—</em>
                          )}
                        </td>

                        {/* ── Answers */}
                        <td>
                          {response ? (
                            response.answers && response.answers.length > 0 ? (
                              <ul className="answers-list">
                                {response.answers.map((ans, idx) => (
                                  <li key={idx} style={{ marginBottom: "0.5rem" }}>
                                    {ans.startsWith("http") ? (
                                      <a
                                        href={ans}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="view-link"
                                      >
                                        View
                                      </a>
                                    ) : (
                                      <span className="text-answer">{ans}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <em>No answers</em>
                            )
                          ) : (
                            <em>—</em>
                          )}
                        </td>

                        {/* ── Actions */}
                        <td>
                          {response ? (
                            <>
                              <button
                                className="delete-response-btn"
                                onClick={() =>
                                  handleDeleteResponse(
                                    interview._id,
                                    response.candidate._id
                                  )
                                }
                              >
                                Delete Response
                              </button>
                              <br />
                              <Link
                                to={`/recruiter/candidate-details/${interview._id}/${candidate._id}`}
                                className="view-details-link"
                              >
                                View Details
                              </Link>
                            </>
                          ) : (
                            <em>—</em>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <div className="back-btn-container">
        <button onClick={() => navigate("/recruiter")} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default RecruiterInterviewResults;
