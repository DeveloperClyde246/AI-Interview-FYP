import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";

const RecruiterCandidateDetails = () => {
  const { interviewId, candidateId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Loading...</p>;

  const { candidate, response } = data;

  return (
    <div>
      <RecruiterNavbar />
      <h2>Candidate Profile</h2>
      <p><strong>Name:</strong> {candidate?.name}</p>
      <p><strong>Email:</strong> {candidate?.email}</p>
      <p><strong>Contact Number:</strong> {candidate?.contactNumber || "Not provided"}</p>
      <p><strong>Role Applied:</strong> {candidate?.roleApplied || "Not specified"}</p>
      <p><strong>Introduction:</strong> {candidate?.introduction || "No introduction provided."}</p>

      <div>
        <strong>Skills:</strong>
        {candidate?.skills && candidate.skills.length > 0 ? (
          <ul>
            {candidate.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills listed.</p>
        )}
      </div>

      <div>
        <strong>Education:</strong>
        {candidate?.education && candidate.education.length > 0 ? (
          <ul>
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
          <h3>Submitted Answers</h3>
          <ul>
          {response.answers.map((ans, i) => (
            <li key={i}>
              {ans.startsWith("http") ? (
                <>
                  <a href={ans} target="_blank" rel="noreferrer">View File</a> |{" "}
                  <a
                    href={`http://localhost:8501/upload_file?video_url=${encodeURIComponent(ans)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Streamlit Analyze
                  </a>
                </>
              ) : (
                ans
              )}
            </li>
          ))}
          </ul>

          {response.videoMarks?.length > 0 && (
            <>
              <h3>Video Marks</h3>
              <ul>
                {response.videoMarks.map((mark, i) => (
                  <li key={i}>Video {i + 1}: {mark} marks</li>
                ))}
              </ul>
              <p><strong>Average Mark:</strong> {response.marks}</p>
            </>
          )}
        </>
      ) : (
        <p><i>This candidate has not submitted answers yet.</i></p>
      )}

      <br />
      <Link to="/recruiter/interview-results">← Back to Results</Link>
    </div>
  );
};

export default RecruiterCandidateDetails;
