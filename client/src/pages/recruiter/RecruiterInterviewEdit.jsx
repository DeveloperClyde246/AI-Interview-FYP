import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const RecruiterInterviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [newQuestions, setNewQuestions] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", scheduled_date: "", answerDuration: 60 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recruiter/interview/${id}`, { withCredentials: true });
        setInterview(res.data.interview);
        setForm({
          title: res.data.interview.title,
          description: res.data.interview.description,
          scheduled_date: res.data.interview.scheduled_date.slice(0, 16),
          answerDuration: res.data.interview.answerDuration || 60,
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

    try {
      const formEl = e.target;
      const updatedQuestions = Array.from(formEl.elements)
        .filter((el) => el.name === "questions[]")
        .map((el, i) => ({
          questionText: el.value,
          answerType: formEl.elements[`answerTypes[]`][i].value,
        }));

      const allQuestions = [...updatedQuestions, ...newQuestions];

      await axios.post(`http://localhost:5000/recruiter/interview/${id}/edit`, {
        ...form,
        questions: allQuestions.map((q) => q.questionText),
        answerTypes: allQuestions.map((q) => q.answerType),
      }, { withCredentials: true });

      navigate("/recruiter/interviews");
    } catch (err) {
      setError("Failed to update interview.");
    }
  };

  const handleAddNewQuestion = () =>
    setNewQuestions([...newQuestions, { questionText: "", answerType: "text" }]);

  const handleNewQuestionChange = (index, key, value) => {
    const updated = [...newQuestions];
    updated[index][key] = value;
    setNewQuestions(updated);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  if (!interview) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Interview Details</h2>
      <form onSubmit={handleEditInterview}>
        <label>Interview Title:</label>
        <input type="text" name="title" value={form.title} onChange={handleInputChange} required />
        <br />

        <label>Interview Description:</label>
        <textarea name="description" value={form.description} onChange={handleInputChange} required />
        <br />

        <label>Scheduled Date:</label>
        <input type="datetime-local" name="scheduled_date" value={form.scheduled_date} onChange={handleInputChange} min={getCurrentDateTime()} required />
        <br />

        <label>Answer Duration (seconds):</label>
        <input type="number" name="answerDuration" value={form.answerDuration} onChange={handleInputChange} min="10" required />
        <br />

        <h3>Edit Existing Questions</h3>
        {interview.questions.map((q, i) => (
          <div key={i}>
            <input name="questions[]" defaultValue={q.questionText} required />
            <select name="answerTypes[]" defaultValue={q.answerType}>
              <option value="text">Text</option>
              <option value="file">File</option>
              <option value="recording">Recording</option>
            </select>
          </div>
        ))}

        {newQuestions.map((q, i) => (
          <div key={`new-${i}`}>
            <input value={q.questionText} onChange={(e) => handleNewQuestionChange(i, "questionText", e.target.value)} placeholder="New question" required />
            <select value={q.answerType} onChange={(e) => handleNewQuestionChange(i, "answerType", e.target.value)}>
              <option value="text">Text</option>
              <option value="file">File</option>
              <option value="recording">Recording</option>
            </select>
          </div>
        ))}

        <button type="button" onClick={handleAddNewQuestion}>➕ Add Another Question</button>
        <button type="submit">Save Changes</button>
      </form>
      <br />
      <Link to={`/recruiter/interview/${id}`}>Back to Interview</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RecruiterInterviewEdit;
