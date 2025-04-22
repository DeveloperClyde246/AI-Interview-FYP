import React, { useState, useEffect, useRef } from "react";
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

  const [timeLeft, setTimeLeft] = useState(0);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const timerRef = useRef(null);


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
        // set timer from DB field answerDuration (in seconds)
        setTimeLeft(res.data.interview.answerDuration);
      } catch (err) {
        console.error("Error fetching interview:", err);
        alert("Error loading interview details.");
      }
    };

    fetchInterviewDetails();
  }, [id]);


  // start countdown once interview loads
  useEffect(() => {
    if (!interview || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // auto‐submit
          submitAnswers();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [interview, timeLeft]);

  // extract the actual POST logic out of handleSubmit so we can call it from timer
  const submitAnswers = async () => {
    if (hasAutoSubmitted) return;
    setHasAutoSubmitted(true);
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
      alert(`Time's up! Submitted. Your average mark: ${res.data.marks ?? "N/A"}`);
      navigate("/candidate/interviews");
    } catch (err) {
      console.error("Auto‐submit error:", err);
    }
  };

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
  // let mediaRecorder;
  // let recordedBlobs = [];
  // let isRecording = false;
  const mediaRecorderRef = useRef(null);
  const recordedBlobsRef   = useRef([]);
  const streamRef        = useRef(null);

  const startVideoRecording = (index) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Show live preview
        const videoPreview = document.getElementById(`video-preview-${index}`);
        videoPreview.srcObject = stream;
        videoPreview.muted    = true;
        videoPreview.play();
  
        // Save the stream so we can stop it later
        streamRef.current = stream;
  
        // Reset blobs and create recorder
        recordedBlobsRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedBlobsRef.current.push(e.data);
          }
        };
  
        mediaRecorderRef.current = recorder;
        recorder.start();
      })
      .catch((error) => {
        console.error("❌ Error accessing camera:", error);
      });
  };
  
  const stopVideoRecording = async (index) => {
    const recorder = mediaRecorderRef.current;
    const stream   = streamRef.current;
    if (!recorder || recorder.state === "inactive") {
      console.warn("No active recorder to stop");
      return;
    }
  
    recorder.onstop = async () => {
      // Stop all camera tracks
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
  
      // Build a blob from recorded chunks
      const videoBlob = new Blob(recordedBlobsRef.current, { type: "video/webm" });
      const videoUrl  = URL.createObjectURL(videoBlob);
      const videoPreview = document.getElementById(`video-preview-${index}`);
      videoPreview.srcObject = null;
      videoPreview.src       = videoUrl;
      videoPreview.controls  = true;
  
      setIsUploading(true);
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", videoBlob);
      formData.append("upload_preset", cloudinaryPreset);
  
      try {
        const res = await fetch(cloudinaryUploadURL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setRecordedVideos((prev) => ({ ...prev, [index]: data.secure_url }));
      } catch (err) {
        console.error("❌ Error uploading video:", err);
      } finally {
        setIsUploading(false);
      }
    };
  
    recorder.stop();
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

    clearInterval(timerRef.current);
  
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
      alert("Please wait for analysis to complete. It may take a few minutes. Will prompt after completion.");
      
      const res = await axios.post(
        `http://localhost:5000/candidate/interview/${id}/submit`,
        formData,
        { withCredentials: true }
      );
      
  
      if (res.status === 200) {
        // ← read `marks` instead of `avgMark`
        alert(`Answers submitted successfully! Average Mark: ${res.data.marks ?? "N/A"}`);
        navigate("/candidate/interviews");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message || "Please wait for analysis to complete");
      } else {
        console.error("❌ Error submitting answers:", err);
        alert("Error submitting answers. Please try again.");
      }
    }
  };

  if (!interview) return <p className="loading">Loading...</p>;

  return (
    <div className="candidate-answer-container">
      <div className="timer">
        ⏱️ Time Remaining: <strong>{timeLeft}</strong>s
      </div>
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
            <button
              type="submit"
              id="submit-btn"
              className="submit-btn"
              disabled={isUploading || !allRecordingsUploaded || hasAutoSubmitted}
            >
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
