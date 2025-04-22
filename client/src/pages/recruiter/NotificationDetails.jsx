import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "../styles/recruiter/RecruiterNotificationDetails.css";

const RecruiterNotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deletable, setDeletable] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/recruiter/notifications/${id}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const notif = res.data.notification;
          setNotification(notif);

          // Check interviewDate from the notification object
          if (notif.interviewDate) {
            const interviewDate = new Date(notif.interviewDate);
            if (!isNaN(interviewDate.getTime())) {
              const now = new Date();
              const timeDiff = interviewDate.getTime() - now.getTime();
              console.log("Interview Date:", interviewDate, "Time Diff:", timeDiff);
              // Disable deletion if the interview is in the future and within the next 24 hours
              if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
                setDeletable(false);
              } else {
                setDeletable(true);
              }
            } else {
              setDeletable(true);
            }
          } else {
            // If there is no interview date, allow deletion
            setDeletable(true);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching notification:", err);
        setError("Error fetching notification.");
      }
    };

    fetchNotification();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/recruiter/notifications/${id}/delete`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("✅ Notification deleted successfully!");
        navigate("/recruiter");
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
    return <p className="loading">Loading notification details...</p>;
  }

  return (
    <div className="notification-details-container">
      <RecruiterNavbar />
      <div className="notification-details-card">
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
        <div className="button-group">
          <button
            onClick={handleDelete}
            disabled={!deletable}
            className="delete-btn"
          >
            Delete Notification
          </button>
          <button
            onClick={() => navigate("/recruiter")}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterNotificationDetails;
