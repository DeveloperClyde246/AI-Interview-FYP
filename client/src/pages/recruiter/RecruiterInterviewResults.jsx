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
      const res = await axios.get("http://localhost:5000/recruiter/interview-results", {
        withCredentials: true,
      });
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
    if (window.confirm("Are you sure you want to delete this response?")) {
      try {
        await axios.post(
          `http://localhost:5000/recruiter/interview/${interviewId}/delete-response`,
          { candidateId },
          { withCredentials: true }
        );
        alert("Response deleted.");
        fetchResults();
      } catch (err) {
        alert("Error deleting response.");
        console.error(err);
      }
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
                    const response = interview.responses.find(
                      (r) => r.candidate?._id === candidate._id
                    );

                    return (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.email}</td>
                        <td>
                          {response ? (
                            response.status === "submitted late" ? "Submitted Late" : "Submitted"
                          ) : (
                            "Pending"
                          )}
                        </td>
                        <td>
                          {response && response.videoMarks?.length > 0 ? (
                            <>
                              <ul className="marks-list">
                                {response.videoMarks.map((mark, i) => (
                                  <li key={i}>
                                    Video {i + 1}: {mark} marks
                                  </li>
                                ))}
                              </ul>
                              <strong className="average-mark">
                                Avg: {response.marks} marks
                              </strong>
                            </>
                          ) : (
                            <i>—</i>
                          )}
                        </td>
                        <td>
                          {response ? (
                            <ul className="answers-list">
                              {response.answers.map((ans, i) => (
                                <li key={i}>
                                  {ans.startsWith("http") ? (
                                    <a href={ans} target="_blank" rel="noreferrer">
                                      View
                                    </a>
                                  ) : (
                                    ans
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <i>—</i>
                          )}
                        </td>
                        <td>
                          {response && (
                            <>
                              <button
                                className="delete-response-btn"
                                onClick={() =>
                                  handleDeleteResponse(interview._id, response.candidate._id)
                                }
                              >
                                Delete Response
                              </button>
                              <br />
                            </>
                          )}
                          <Link
                            to={`/recruiter/candidate-details/${interview._id}/${candidate._id}`}
                            className="view-details-link"
                          >
                            View Details
                          </Link>
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
