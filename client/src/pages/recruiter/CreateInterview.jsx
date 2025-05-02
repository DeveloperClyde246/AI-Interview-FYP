import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/CreateInterview.css";

const CreateInterview = () => {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduled_date: "",
    questions: [{ questionText: "", answerType: "text", recordingRequired: false }],
    candidateIds: [],
    answerDuration: 60, // Default duration in minutes
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/recruiter/create-interview", {
          withCredentials: true,
        });
        setCandidates(res.data.candidates);
      } catch (err) {
        console.error("Error fetching candidates:", err.message);
      }
    };
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index][key] = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        { questionText: "", answerType: "text", recordingRequired: false },
      ],
    });
  };

  const removeQuestion = (index) => {
    // Allow removal only if there's more than one question
    if (form.questions.length > 1) {
      setForm({
        ...form,
        questions: form.questions.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/recruiter/create-interview", form, {
        withCredentials: true,
      });
      navigate("/recruiter");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Error creating interview.");
      }
    }
  };

  // Return the current date/time in a format suitable for a datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="create-interview-container">
      <RecruiterNavbar />
      <div className="create-interview-card">
        <h2>Create New Interview</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="create-interview-form">
          <div className="form-group">
            <label>Interview Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Interview Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
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
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Answer Duration (Seconds):</label>
            <input
              type="number"
              name="answerDuration"
              value={form.answerDuration}
              onChange={handleChange}
              min="1"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <h3>Interview Questions</h3>
            {form.questions.map((q, index) => (
              <div key={index} className="question-group">
                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(index, "questionText", e.target.value)
                  }
                  required
                  className="form-input"
                />
                <select
                  value={q.answerType}
                  onChange={(e) =>
                    handleQuestionChange(index, "answerType", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="text">Text-Based Answer</option>
                  <option value="recording">Recording on Portal</option>
                </select>
                {form.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="remove-btn"
                  >
                    Remove Question
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="add-btn">
              ➕ Add Another Question
            </button>
          </div>

          <div className="form-group skills-group">
            <h3>Select Candidates</h3>
            {candidates.map((c) => (
              <div key={c._id} className="candidate-checkbox">
                <input
                  type="checkbox"
                  value={c._id}
                  checked={form.candidateIds.includes(c._id)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setForm({
                      ...form,
                      candidateIds: isChecked
                        ? [...form.candidateIds, c._id]
                        : form.candidateIds.filter((id) => id !== c._id),
                    });
                  }}
                />
                <span>
                  {c.name} ({c.email})
                </span>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn">
            Create Interview
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;
