import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const RecruiterInterviewViewDetails = () => {
  const { id } = useParams();
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

  if (!interview) return <p>Loading interview details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Interview Details</h2>

      <p><strong>Title:</strong> {interview.title}</p>
      <p><strong>Description:</strong> {interview.description}</p>
      <p><strong>Scheduled Date:</strong> {new Date(interview.scheduled_date).toLocaleString()}</p>
      <p><strong>Answer Duration:</strong> {interview.answerDuration} seconds</p>

      <h3>Questions</h3>
      <ol>
        {interview.questions.map((q, i) => (
          <li key={i}>
            {q.questionText} — <i>{q.answerType}</i>
          </li>
        ))}
      </ol>

      <h3>Assigned Candidates</h3>
      {interview.candidates.length > 0 ? (
        <ul>
          {interview.candidates.map((c) => (
            <li key={c._id}>
              {c.name} ({c.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No candidates assigned yet.</p>
      )}

      <br />
      <div>
        <Link to={`/recruiter/interview/${id}/manage`}>
          <button>Manage Candidates</button>
        </Link>{" "}
        <Link to={`/recruiter/interview/${id}/edit`}>
          <button>Edit Interview Form</button>
        </Link>
      </div>

      <br />
      <Link to="/recruiter/interviews">← Back to Interviews</Link>
    </div>
  );
};

export default RecruiterInterviewViewDetails;
