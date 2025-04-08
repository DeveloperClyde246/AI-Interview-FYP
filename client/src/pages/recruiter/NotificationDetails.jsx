import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar"; 

const NotificationDetails = () => {
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
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!notification) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <RecruiterNavbar />
      <h2>Notification Details</h2>
      <p>
        <strong>Message:</strong> {notification.message}
      </p>
      <p>
        <strong>Notification created At:</strong> {new Date(notification.createdAt).toLocaleString()}
      </p>

      <button onClick={handleDelete} disabled={!deletable}>
        Delete Notification
      </button>
      <br />
      <a href="/recruiter">Back to Dashboard</a>
    </div>
  );
};

export default NotificationDetails;
