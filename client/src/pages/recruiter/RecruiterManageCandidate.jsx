import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar"; 

const RecruiterManageCandidate = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [error, setError] = useState("");

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

  if (!interview) return <p>Loading...</p>;

  const unassigned = allCandidates.filter(
    (c) => !interview.candidates.some((i) => i._id === c._id)
  );

  return (
    <div>
      <RecruiterNavbar />
      <h2>Manage Candidates for: {interview.title}</h2>

      <h3>Assigned Candidates</h3>
      <ul>
        {interview.candidates.length > 0 ? (
          interview.candidates.map((c) => (
            <li key={c._id}>
              {c.name} ({c.email})
              <button onClick={() => handleUnassign(c._id)}>Unassign</button>
            </li>
          ))
        ) : (
          <p>No candidate assigned.</p>
        )}
      </ul>

      <h3>Add More Candidates</h3>
      {unassigned.length === 0 ? (
        <p>All users are already assigned.</p>
      ) : (
        <>
          {unassigned.map((c) => (
            <div key={c._id}>
              <input
                type="checkbox"
                checked={selectedCandidates.includes(c._id)}
                onChange={() => toggleCandidate(c._id)}
              />
              {c.name} ({c.email})
            </div>
          ))}
          <button onClick={handleAddCandidates}>Add Selected Candidates</button>
        </>
      )}
      <br />
      <Link to={`/recruiter/interview/${id}`}>Back to Interview</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RecruiterManageCandidate;
