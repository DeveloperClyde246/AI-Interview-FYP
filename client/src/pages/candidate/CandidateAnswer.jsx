import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CandidateAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [fileAnswers, setFileAnswers] = useState({});
  const [recordedVideos, setRecordedVideos] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false); // ✅ Track if video is uploaded
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const cloudinaryPreset = "interview_responses"; // Update from Cloudinary settings
  const cloudinaryUploadURL = "https://api.cloudinary.com/v1_1/dnxuioifx/video/upload"; // Cloudinary Upload URL
  const mediaRecorders = useRef({});
  const recordedBlobMap = useRef({});
  const streamMap = useRef({});


  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/candidate/interview/${id}`, {
          withCredentials: true,
        });
        setInterview(res.data.interview);
        setAnswers(Array(res.data.interview.questions.length).fill(""));

        // Start timer only once
        if (!timerStarted) {
          const durationInSeconds = res.data.interview.answerDuration * 60; // Convert minutes to seconds
          setTimeLeft(durationInSeconds);
          setTimerStarted(true);
        }

      } catch (err) {
        console.error("Error fetching interview:", err);
        alert("Error loading interview details.");
      }
    };

    fetchInterviewDetails();
  }, [id]);

  // ✅ Timer Logic
  useEffect(() => {
    if (!timerStarted || timeLeft === null) return;
  
    if (timeLeft === 0) {
      alert("Time's up! Submitting your answers automatically.");
      handleSubmit(new Event("submit")); // auto-submit
      return;
    }
  
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timerStarted]);


  // ✅ Handle Text and File Changes
  const handleInputChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleFileChange = (index, file) => {
    setFileAnswers({ ...fileAnswers, [index]: file });
  };

  // ✅ Handle Video Recording
  let mediaRecorder;
  let recordedBlobs = [];
  let isRecording = false;

  const startVideoRecording = (index) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoPreview = document.getElementById(`video-preview-${index}`);
        videoPreview.srcObject = stream;
        videoPreview.muted = true;
        videoPreview.play();
  
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recordedBlobMap.current[index] = [];
  
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) recordedBlobMap.current[index].push(event.data);
        };
  
        recorder.start();
        mediaRecorders.current[index] = recorder;
        streamMap.current[index] = stream;
      })
      .catch((error) => {
        console.error("❌ Error accessing camera:", error);
      });
  };

  const stopVideoRecording = async (index) => {
    const recorder = mediaRecorders.current[index];
    const stream = streamMap.current[index];
  
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
  
      recorder.onstop = async () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
  
        const videoBlob = new Blob(recordedBlobMap.current[index], { type: "video/webm" });
        const videoUrl = URL.createObjectURL(videoBlob);
        const videoPreview = document.getElementById(`video-preview-${index}`);
        videoPreview.srcObject = null;
        videoPreview.src = videoUrl;
        videoPreview.controls = true;
  
        setIsUploading(true);
  
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
          setIsUploading(false);
          setVideoUploaded(true);
        } catch (error) {
          console.error("❌ Error uploading video to Cloudinary:", error);
          setIsUploading(false);
        }
      };
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if videos are still uploading
    if (isUploading) {
      alert("Please wait for the video to finish uploading before submitting.");
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
      const res = await axios.post(`http://localhost:5000/candidate/interview/${id}/submit`, formData, {
        withCredentials: true,
      });

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


  if (!interview) return <p>Loading...</p>;

  // ✅ Format Time Left
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  return (
    <div>
      <h2>Answer Questions - {interview.title}</h2>
      {timeLeft !== null && (
        <h3 style={{ color: "red" }}>
          Time Remaining: {formatTime(timeLeft)}
        </h3>
      )}
      <form id="answer-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {interview.questions.map((question, index) => (
          <div key={index}>
            <p>
              <strong>Question {index + 1}:</strong> {question.questionText}
            </p>

            {question.answerType === "text" && (
              <textarea
                name={`answers[${index}]`}
                value={answers[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required
              />
            )}

            {question.answerType === "file" && (
              <input
                type="file"
                name={`fileAnswers[${index}]`}
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                accept="*/*"
              />
            )}

            {question.answerType === "recording" && (
              <div>
                <button type="button" onClick={() => startVideoRecording(index)}>
                  Start Recording
                </button>
                <button type="button" onClick={() => stopVideoRecording(index)}>
                  Stop Recording
                </button>
                <video id={`video-preview-${index}`} controls autoPlay muted></video>
                <input type="hidden" name={`answers[${index}]`} value={recordedVideos[index] || ""} />
              </div>
            )}

            <hr />
          </div>
        ))}

        <button
          type="submit"
          id="submit-btn"
          disabled={
            isUploading ||
            (interview.questions.some(q => q.answerType === "recording") && !videoUploaded)
          }
        >
          Submit Answers
        </button>
      </form>

      <button onClick={() => navigate("/candidate/interviews")}>Back to Interviews</button>
    </div>
  );
};

export default CandidateAnswer;
