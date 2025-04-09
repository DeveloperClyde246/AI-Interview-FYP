import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterInterviewEdit.css";

const RecruiterInterviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", scheduled_date: "", answerDuration: 60 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recruiter/interview/${id}`, { withCredentials: true });
        const interviewData = res.data.interview;
        setInterview(interviewData);
        setExistingQuestions(interviewData.questions);
        setForm({
          title: interviewData.title,
          description: interviewData.description,
          scheduled_date: interviewData.scheduled_date.slice(0, 16),
          answerDuration: interviewData.answerDuration || 60,
        });
      } catch (err) {
        setError("Failed to load interview details.");
      }
    };

    fetchDetails();
  }, [id]);

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditInterview = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Gather updated questions from existing questions inputs
      // We'll assume that input/select names match
      // We combine the current state arrays for existing and new questions.
      const allQuestions = [...existingQuestions, ...newQuestions];

      await axios.post(
        `http://localhost:5000/recruiter/interview/${id}/edit`,
        {
          ...form,
          questions: allQuestions.map((q) => q.questionText),
          answerTypes: allQuestions.map((q) => q.answerType),
        },
        { withCredentials: true }
      );

      navigate("/recruiter/interviews");
    } catch (err) {
      setError("Failed to update interview.");
    }
  };

  const handleAddNewQuestion = () =>
    setNewQuestions([...newQuestions, { questionText: "", answerType: "text" }]);

  const handleRemoveNewQuestion = (index) => {
    setNewQuestions(newQuestions.filter((_, i) => i !== index));
  };

  const handleRemoveExistingQuestion = (index) => {
    if (existingQuestions.length > 1) {
      setExistingQuestions(existingQuestions.filter((_, i) => i !== index));
    }
  };

  // Return the current date/time in a format suitable for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (!interview) return <p className="loading">Loading...</p>;

  return (
    <div className="edit-interview-container">
      <RecruiterNavbar />
      <div className="edit-interview-card">
        <h2>Edit Interview Details</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleEditInterview} className="edit-interview-form">
          <div className="form-group">
            <label>Interview Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Interview Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              required
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label>Scheduled Date:</label>
            <input
              type="datetime-local"
              name="scheduled_date"
              value={form.scheduled_date}
              min={getCurrentDateTime()}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Answer Duration (seconds):</label>
            <input
              type="number"
              name="answerDuration"
              value={form.answerDuration}
              onChange={handleInputChange}
              min="10"
              required
              className="form-input"
            />
          </div>

          <h3>Edit Existing Questions</h3>
          <div className="existing-questions">
            {existingQuestions.map((q, i) => (
              <div key={i} className="question-group">
                <input
                  name="questions[]"
                  value={q.questionText}
                  onChange={(e) => {
                    const updated = [...existingQuestions];
                    updated[i].questionText = e.target.value;
                    setExistingQuestions(updated);
                  }}
                  required
                  className="form-input"
                />
                <select
                  name="answerTypes[]"
                  value={q.answerType}
                  onChange={(e) => {
                    const updated = [...existingQuestions];
                    updated[i].answerType = e.target.value;
                    setExistingQuestions(updated);
                  }}
                  className="form-select"
                >
                  <option value="text">Text</option>
                  <option value="file">File</option>
                  <option value="recording">Recording</option>
                </select>
                {existingQuestions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingQuestion(i)}
                    className="remove-btn"
                  >
                    Remove Question
                  </button>
                )}
              </div>
            ))}
          </div>

          {newQuestions.length > 0 && <h3>New Questions</h3>}
          <div className="new-questions">
            {newQuestions.map((q, i) => (
              <div key={`new-${i}`} className="question-group new-question">
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) =>
                    setNewQuestions((prev) => {
                      const updated = [...prev];
                      updated[i].questionText = e.target.value;
                      return updated;
                    })
                  }
                  placeholder="Enter new question"
                  required
                  className="form-input"
                />
                <select
                  value={q.answerType}
                  onChange={(e) =>
                    setNewQuestions((prev) => {
                      const updated = [...prev];
                      updated[i].answerType = e.target.value;
                      return updated;
                    })
                  }
                  className="form-select"
                >
                  <option value="text">Text</option>
                  <option value="file">File</option>
                  <option value="recording">Recording</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveNewQuestion(i)}
                  className="remove-btn"
                >
                  Remove Question
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddNewQuestion} className="add-btn">
            ➕ Add Another Question
          </button>
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
        <div className="back-link-container">
          <button onClick={() => navigate(`/recruiter/interview/${id}`)} className="back-btn">
            ← Back to Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterInterviewEdit;
