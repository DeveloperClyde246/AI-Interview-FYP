import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterManageCandidate.css";
import { useNavigate } from "react-router-dom";

const RecruiterManageCandidate = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/recruiter/interview/${id}`, {
        withCredentials: true,
      });
      setInterview(res.data.interview);
      setAllCandidates(res.data.allCandidates);
    } catch (err) {
      setError("Failed to load candidate data.");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUnassign = async (candidateId) => {
    try {
      await axios.post(
        `http://localhost:5000/recruiter/interview/${id}/unassign-candidate`,
        { candidateId },
        { withCredentials: true }
      );
      fetchDetails();
    } catch (err) {
      setError("Unassign failed.");
    }
  };

  const handleAddCandidates = async () => {
    try {
      await axios.post(
        `http://localhost:5000/recruiter/interview/${id}/add-candidates`,
        { candidateIds: selectedCandidates },
        { withCredentials: true }
      );
      setSelectedCandidates([]);
      fetchDetails();
    } catch (err) {
      setError("Add candidates failed.");
    }
  };

  const toggleCandidate = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  if (!interview) return <p className="loading">Loading...</p>;

  // Filter for candidates not already assigned
  const unassigned = allCandidates.filter(
    (c) => !interview.candidates.some((i) => i._id === c._id)
  );

  return (
    <div className="manage-candidate-container">
      <RecruiterNavbar />
      <div className="manage-candidate-card">
        <h2>Manage Candidates for: {interview.title}</h2>
        
        <section className="assigned-section">
          <h3>Assigned Candidates</h3>
          {interview.candidates.length > 0 ? (
            <ul className="assigned-list">
              {interview.candidates.map((c) => (
                <li key={c._id}>
                  <span>
                    {c.name} ({c.email})
                  </span>
                  <button onClick={() => handleUnassign(c._id)}>Unassign</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidate assigned.</p>
          )}
        </section>

        <section className="unassigned-section">
          <h3>Add More Candidates</h3>
          {unassigned.length === 0 ? (
            <p>All users are already assigned.</p>
          ) : (
            <>
              {unassigned.map((c) => (
                <div key={c._id} className="unassigned-item">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(c._id)}
                    onChange={() => toggleCandidate(c._id)}
                  />
                  <span>
                    {c.name} ({c.email})
                  </span>
                </div>
              ))}
              <button onClick={handleAddCandidates} className="action-btn">
                Add Selected Candidates
              </button>
            </>
          )}
        </section>
        
        <div className="back-link-container">
          <button onClick={() => navigate(`/recruiter/interview/${id}`)} className="back-btn">
            ← Back to Interview
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default RecruiterManageCandidate;
