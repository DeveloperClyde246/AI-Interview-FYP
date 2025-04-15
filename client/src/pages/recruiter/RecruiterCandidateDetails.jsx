import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterCandidateDetails.css";
import { useNavigate } from "react-router-dom";

const RecruiterCandidateDetails = () => {
  const { interviewId, candidateId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch candidate details when component mounts or params change
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/recruiter/candidate-details/${interviewId}/${candidateId}`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error loading candidate details:", err);
        setError("Failed to load candidate details.");
      }
    };
    fetchDetails();
  }, [interviewId, candidateId]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="loading">Loading...</p>;

  const { candidate, response } = data;

  return (
    <div className="candidate-details-container">
      <RecruiterNavbar />
      <div className="candidate-details-card">
        <h2>Candidate Profile</h2>
        <div className="candidate-info">
          <p>
            <strong>Name:</strong> {candidate?.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate?.email}
          </p>
          <p>
            <strong>Contact Number:</strong>{" "}
            {candidate?.contactNumber || "Not provided"}
          </p>
          <p>
            <strong>Role Applied:</strong>{" "}
            {candidate?.roleApplied || "Not specified"}
          </p>
          <p>
            <strong>Introduction:</strong>{" "}
            {candidate?.introduction || "No introduction provided."}
          </p>
        </div>

        <div className="section">
          <h3>Skills</h3>
          {candidate?.skills && candidate.skills.length > 0 ? (
            <ul className="list">
              {candidate.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )}
        </div>

        <div className="section">
          <h3>Education</h3>
          {candidate?.education && candidate.education.length > 0 ? (
            <ul className="list">
              {candidate.education.map((edu, idx) => (
                <li key={idx}>
                  {edu.degree} from {edu.institution} ({edu.yearOfCompletion})
                </li>
              ))}
            </ul>
          ) : (
            <p>No education details provided.</p>
          )}
        </div>

        {response ? (
          <>
            <div className="section">
              <h3>Submitted Answers</h3>
              <ol className="answers-list">
                {response.answers.map((ans, i) => (
                  <li key={i}>
                    {ans.startsWith("http") ? (
                      <>
                        <a href={ans} target="_blank" rel="noreferrer">
                          View File
                        </a>{" "}
                        |{" "}
                        <a
                          href={`http://localhost:8501/upload_file?video_url=${encodeURIComponent(
                            ans
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Analysis Details
                        </a>
                      </>
                    ) : (
                      ans
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {response.videoMarks?.length > 0 && (
              <div className="section">
                <h3>Video Marks</h3>
                <ul className="list">
                  {response.videoMarks.map((mark, i) => (
                    <li key={i}>Video {i + 1}: {mark} marks</li>
                  ))}
                </ul>
                <p className="average-mark">
                  <strong>Average Mark:</strong> {response.marks}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="no-response"><i>This candidate has not submitted answers yet.</i></p>
        )}

        <div className="back-btn-container">
        <button onClick={() => navigate("/recruiter/interview-results")} className="back-btn">
  ← Back to Results
</button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCandidateDetails;
