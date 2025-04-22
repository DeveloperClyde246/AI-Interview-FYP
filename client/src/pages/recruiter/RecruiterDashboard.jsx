import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/candidate/CandidateDashboard.css";

const RecruiterDashboard = () => {
  const [data, setData] = useState({
    username: "",
    notifications: [],
    interviews: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        alert("Logout successful!");
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="candidate-dashboard-container">
      <RecruiterNavbar />
      <div className="candidate-dashboard-card">
        <h2>Recruiter Dashboard</h2>
        <p>Welcome, {username || "Loading..."}!</p>

        <section className="notifications">
          <h3>Notifications</h3>
          <ul>
            {notifications.length === 0 ? (
              <li>No new notifications</li>
            ) : (
              notifications.map((notification) => (
                <li key={notification._id}>
                  <Link to={`notifications/${notification._id}`}>
                    {notification.message} -{" "}
                    {new Date(notification.createdAt).toLocaleString()}
                  </Link>{" "}
                  ({notification.status === "unread" ? "🔔" : "✅"})
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="interviews">
          <h3>Your Scheduled Interviews</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Candidate</th>
                <th>Scheduled Date</th>
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan="3">No scheduled interviews</td>
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
                    {/* <td>{interview.status || "Pending"}</td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Uncomment this if you wish to include a logout button on the dashboard */}
        {/* <button onClick={handleLogout} className="logout-btn">
          Logout
        </button> */}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
