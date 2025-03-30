import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterDashboard = () => {
  const [data, setData] = useState({
    username: "",
    notifications: [],
    interviews: [],
  });
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ Add useNavigate for redirection

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/recruiter", {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Failed to load dashboard.");
      }
    };

    fetchDashboard();
  }, []);

  const { username, notifications, interviews } = data;

  // ✅ Handle logout and redirect to login
  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Logout successful!");
        navigate("/login"); // ✅ Redirect to login after successful logout
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div>
      <h2>Recruiter Dashboard</h2>
      <p>Welcome, {username || "Loading..."}</p>

      <h3>Notifications</h3>
      <ul>
        {notifications.length === 0 ? (
          <li>No new notifications</li>
        ) : (
          notifications.map((n) => (
            <li key={n._id}>
              <Link to={`notifications/${n._id}`}>
                {n.message} - {n.status === "unread" ? "🔔" : "✅"}
              </Link>
            </li>
          ))
        )}
      </ul>

      <h3>Your Scheduled Interviews</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Title</th>
            <th>Candidate</th>
            <th>Scheduled Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {interviews.length === 0 ? (
            <tr>
              <td colSpan="4">No scheduled interviews</td>
            </tr>
          ) : (
            interviews.map((interview) => (
              <tr key={interview._id}>
                <td>{interview.title}</td>
                <td>
                  {interview.candidates.length > 0 ? (
                    interview.candidates.map((candidate) => (
                      <div key={candidate._id}>
                        {candidate.name} ({candidate.email})
                      </div>
                    ))
                  ) : (
                    "No candidates assigned"
                  )}
                </td>
                <td>
                  {interview.scheduled_date
                    ? new Date(interview.scheduled_date).toLocaleString()
                    : "Not Scheduled"}
                </td>
                <td>{interview.status || "Pending"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <br />
      {/* ✅ Replaced <a> with button to trigger handleLogout */}
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RecruiterDashboard;
