import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch Dashboard Data (Notifications & Interviews)
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/candidate", {
        withCredentials: true,
      });
      setUsername(res.data.username);
      setNotifications(res.data.notifications || []);
      setInterviews(res.data.interviews || []);
    } catch (err) {
      console.error("❌ Error loading candidate dashboard:", err.message);
      setError("Error loading dashboard.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Handle Logout
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
      <h2>Candidate Dashboard</h2>
      <p>Welcome, {username}!</p>

      {/* ✅ Notifications Section */}
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

      {/* ✅ Interviews Section */}
      <h3>Your Scheduled Interviews</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Title</th>
            <th>Recruiter</th>
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
                  {interview.recruiterId.name} ({interview.recruiterId.email})
                </td>
                <td>{new Date(interview.scheduled_date).toLocaleString()}</td>
                <td>{interview.status || "Pending"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <br />
      {/* ✅ Logout Button */}
      <button onClick={handleLogout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CandidateDashboard;
