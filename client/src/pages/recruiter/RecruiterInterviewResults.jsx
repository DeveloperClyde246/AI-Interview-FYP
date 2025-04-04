import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecruiterInterviewResults = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h2>Interview Analysis Results</h2>
      {interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        interviews.map((interview) => (
          <div key={interview._id}>
            <h3>
              {interview.title} —{" "}
              {new Date(interview.scheduled_date).toLocaleString()}
            </h3>
            <p>{interview.description}</p>

            <h4>All Candidates</h4>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Marks</th>
                  <th>Answers</th>
                  <th>View Details</th>
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
                      <td>{response ? "Submitted" : "Pending"}</td>
                      <td>
                        {response && response.videoMarks?.length > 0 ? (
                          <>
                            <ul>
                              {response.videoMarks.map((mark, i) => (
                                <li key={i}>Video {i + 1}: {mark} marks</li>
                              ))}
                            </ul>
                            <strong>Average: {response.marks} marks</strong>
                          </>
                        ) : (
                          <i>—</i>
                        )}
                      </td>
                      <td>
                        {response ? (
                          <>
                            <ul>
                              {response.answers.map((ans, i) => (
                                <li key={i}>
                                  {ans.startsWith("http") ? (
                                    <a href={ans} target="_blank" rel="noreferrer">View</a>
                                  ) : (
                                    ans
                                  )}
                                </li>
                              ))}
                            </ul>

                            <button
                              style={{ marginTop: "5px", color: "red" }}
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this response?")) {
                                  try {
                                    await axios.post(
                                      `http://localhost:5000/recruiter/interview/${interview._id}/delete-response`,
                                      { candidateId: response.candidate._id },
                                      { withCredentials: true }
                                    );
                                    alert("Response deleted.");
                                    fetchResults(); // Refresh results
                                  } catch (err) {
                                    alert("Error deleting response.");
                                    console.error(err);
                                  }
                                }
                              }}
                            >
                              Delete Response
                            </button>
                          </>
                        ) : <i>—</i>}
                      </td>
                      <td>
                        <Link to={`/recruiter/candidate-details/${interview._id}/${candidate._id}`}>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <hr />
          </div>
        ))
      )}
      <br />
      <Link to="/recruiter">← Back to Dashboard</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RecruiterInterviewResults;
