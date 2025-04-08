import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import CandidateNavbar from "../components/CandidateNavbar";
import "../styles/candidate/CandidateAnswer.css";

const CandidateAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [fileAnswers, setFileAnswers] = useState({});
  const [recordedVideos, setRecordedVideos] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const cloudinaryPreset = "interview_responses"; // Update from Cloudinary settings
  const cloudinaryUploadURL = "https://api.cloudinary.com/v1_1/dnxuioifx/video/upload"; // Cloudinary Upload URL

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/candidate/interview/${id}`, {
          withCredentials: true,
        });
        setInterview(res.data.interview);
        setAnswers(Array(res.data.interview.questions.length).fill(""));
      } catch (err) {
        console.error("Error fetching interview:", err);
        alert("Error loading interview details.");
      }
    };

    fetchInterviewDetails();
  }, [id]);

  // Handle Text and File Changes
  const handleInputChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleFileChange = (index, file) => {
    setFileAnswers({ ...fileAnswers, [index]: file });
  };

  // Handle Video Recording
  let mediaRecorder;
  let recordedBlobs = [];
  let isRecording = false;

  const startVideoRecording = (index) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoPreview = document.getElementById(`video-preview-${index}`);
        videoPreview.srcObject = stream;
        videoPreview.muted = true; // ensures no feedback noise
        videoPreview.play(); // Start playing live stream  
        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recordedBlobs = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) recordedBlobs.push(event.data);
        };

        mediaRecorder.start();
        isRecording = true;
      })
      .catch((error) => {
        console.error("❌ Error accessing camera:", error);
      });
  };

  const stopVideoRecording = async (index) => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(recordedBlobs, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(videoBlob);
        const videoPreview = document.getElementById(`video-preview-${index}`);
        videoPreview.srcObject = null;
        videoPreview.src = videoUrl;
        videoPreview.controls = true;

        setIsUploading(true);

        // Upload Video to Cloudinary
        let formData = new FormData();
        formData.append("file", videoBlob);
        formData.append("upload_preset", cloudinaryPreset);

        try {
          const res = await fetch(cloudinaryUploadURL, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          setRecordedVideos((prev) => ({ ...prev, [index]: data.secure_url }));
          setIsUploading(false);
        } catch (error) {
          console.error("❌ Error uploading video to Cloudinary:", error);
          setIsUploading(false);
        }
      };
    }
  };

  // Compute if all video questions have been answered (if any)
  const allRecordingsUploaded = interview
    ? interview.questions.every((question, index) => {
        if (question.answerType === "recording") {
          return recordedVideos[index];
        }
        return true;
      })
    : true;

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if videos are still uploading or not all recordings are uploaded
    if (isUploading || !allRecordingsUploaded) {
      alert("Please wait for all video uploads to complete before submitting.");
      return;
    }

    const formData = new FormData();
    answers.forEach((answer, index) => {
      if (recordedVideos[index]) {
        formData.append(`answers[${index}]`, recordedVideos[index]);
      } else if (fileAnswers[index]) {
        formData.append(`fileAnswers[${index}]`, fileAnswers[index]);
      } else {
        formData.append(`answers[${index}]`, answer);
      }
    });

    try {
      const res = await axios.post(
        `http://localhost:5000/candidate/interview/${id}/submit`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert(`Answers submitted successfully! Average Mark: ${res.data.avgMark || "N/A"}`);
        navigate("/candidate/interviews");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message || "You have already submitted answers for this interview.");
      } else {
        console.error("❌ Error submitting answers:", err);
        alert("Error submitting answers. Please try again.");
      }
    }
  };

  if (!interview) return <p className="loading">Loading...</p>;

  return (
    <div className="candidate-answer-container">
      {/* Uncomment below if you wish to display the navbar */}
      {/* <CandidateNavbar /> */}
      <div className="candidate-answer-card">
        <h2>Answer Questions - {interview.title}</h2>
        <form id="answer-form" onSubmit={handleSubmit} encType="multipart/form-data" className="candidate-answer-form">
          {interview.questions.map((question, index) => (
            <div key={index} className="question-block">
              <p className="question-text">
                <strong>Question {index + 1}:</strong> {question.questionText}
              </p>

              {question.answerType === "text" && (
                <textarea
                  name={`answers[${index}]`}
                  value={answers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  required
                  className="text-answer"
                />
              )}

              {question.answerType === "file" && (
                <input
                  type="file"
                  name={`fileAnswers[${index}]`}
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  accept="*/*"
                  className="file-input"
                />
              )}

              {question.answerType === "recording" && (
                <div className="recording-section">
                  <div className="record-buttons">
                    <button type="button" onClick={() => startVideoRecording(index)} className="record-btn">
                      Start Recording
                    </button>
                    <button type="button" onClick={() => stopVideoRecording(index)} className="record-btn">
                      Stop Recording
                    </button>
                  </div>
                  <video id={`video-preview-${index}`} className="video-preview" controls autoPlay muted></video>
                  <input type="hidden" name={`answers[${index}]`} value={recordedVideos[index] || ""} />
                </div>
              )}
            </div>
          ))}

          <div className="action-buttons">
            <button type="submit" id="submit-btn" className="submit-btn" disabled={isUploading || !allRecordingsUploaded}>
              Submit Answers
            </button>
          </div>
        </form>
        {/* <button onClick={() => navigate("/candidate/interviews")} className="back-btn">
          Back to Interviews
        </button> */}
      </div>
    </div>
  );
};

export default CandidateAnswer;
