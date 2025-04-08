import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateNotificationDetails.css";

const CandidateNotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deletable, setDeletable] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/candidate/notifications/${id}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          setNotification(res.data.notification);

          // Check if the interview is within 24 hours (if applicable)
          if (res.data.interviewDate) {
            const interviewDate = new Date(res.data.interviewDate);
            const now = new Date();
            const timeDiff = interviewDate - now;

            // Disable delete if interview within 24 hours
            if (timeDiff <= 24 * 60 * 60 * 1000 && timeDiff > 0) {
              setDeletable(false);
            }
          }
        }
      } catch (err) {
        console.error("❌ Error fetching notification:", err);
        setError("Error fetching notification.");
      }
    };

    fetchNotification();
  }, [id]);

  // Handle Notification Deletion
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/candidate/notifications/${id}/delete`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("✅ Notification deleted successfully!");
        navigate("/candidate");
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert(
          err.response.data.message ||
            "You cannot delete this notification because the interview is happening within 24 hours."
        );
      } else {
        console.error("❌ Error deleting notification:", err);
        alert("Error deleting notification. Please try again.");
      }
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!notification) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="container">
      <CandidateNavbar />
      <div className="notification-card">
        <h2>Notification Details</h2>
        <div className="detail-group">
          <p>
            <strong>Message:</strong> {notification.message}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="actions">
          <button onClick={handleDelete} disabled={!deletable} className="delete-btn">
            Delete Notification
          </button>
        </div>
        <Link to="/candidate" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CandidateNotificationDetails;
