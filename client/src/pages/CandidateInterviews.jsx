import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch assigned interviews on load
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/candidate/interviews",
          { withCredentials: true }
        );
        setInterviews(res.data.interviews);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching interviews:", error.message);
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <p>Loading interviews...</p>;
  }

  return (
    <div className="container">
      <h2>My Interviews</h2>

      <table border="1" className="interview-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Recruiter</th>
            <th>Scheduled Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviews.length === 0 ? (
            <tr>
              <td colSpan="4">No assigned interviews</td>
            </tr>
          ) : (
            interviews.map((interview) => (
              <tr key={interview._id}>
                <td>{interview.title}</td>
                <td>
                  {interview.recruiterId.name} ({interview.recruiterId.email})
                </td>
                <td>
                  {new Date(interview.scheduled_date).toLocaleString()}
                </td>
                <td>
                  <Link to={`/candidate/interview/${interview._id}`}>
                    Answer Questions
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Link to="/candidate" className="back-link">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default CandidateInterviews;
