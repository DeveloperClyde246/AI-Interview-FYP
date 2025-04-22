// src/pages/RecruiterCandidateDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Plot from "react-plotly.js";
import "../styles/recruiter/RecruiterCandidateDetails.css";
import RecruiterNavbar from "../components/RecruiterNavbar";

export default function RecruiterCandidateDetails() {
  const { interviewId, candidateId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [openAnalysis, setOpenAnalysis] = useState({});

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/recruiter/candidate-details/${interviewId}/${candidateId}`,
        { withCredentials: true }
      )
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load candidate details."));
  }, [interviewId, candidateId]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="loading">Loading…</p>;

  const { candidate, response } = data;
  const analyses = response.analysis || [];
  const emotionClasses = ["Angry","Disgust","Fear","Happy","Sad","Surprise","Neutral"];
  const traitLabels = ["Neuroticism","Extraversion","Agreeableness","Conscientiousness","Openness"];

  return (
    <div className="candidate-details-container">
      <RecruiterNavbar />
      <div className="candidate-details-card">

        {/* PROFILE */}
        <section>
          <h3>👤 Profile</h3>
          <p><strong>Name:</strong> {candidate.name}</p>
          <p><strong>Email:</strong> {candidate.email}</p>
          <p><strong>Contact:</strong> {candidate.contactNumber ?? "—"}</p>
          <p><strong>Role:</strong> {candidate.roleApplied ?? "—"}</p>
          <p><strong>Intro:</strong> {candidate.introduction ?? "—"}</p>

          <h4>Skills</h4>
          {candidate.skills?.length
            ? <ul>{candidate.skills.map((s,i)=><li key={i}>{s}</li>)}</ul>
            : <p>— none listed</p>
          }

          <h4>Education</h4>
          {candidate.education?.length
            ? <ul>
                {candidate.education.map((e,i)=>
                  <li key={i}>{e.degree} from {e.institution} ({e.yearOfCompletion})</li>
                )}
              </ul>
            : <p>— none listed</p>
          }
        </section>

        {/* ANSWERS */}
        <section>
          <h3>📨 Submitted Answers</h3>
          <p><strong>Status:</strong> {response.status}</p>
          <p><strong>Submitted at:</strong> {new Date(response.submitDateTime).toLocaleString()}</p>
          <ol>
            {response.answers.map((ans, i) => (
              <li key={i} className="answer-item">
                {ans.startsWith("http") ? (
                  <button
                    className="view-file-btn"
                    onClick={() => window.open(ans, "_blank")}
                  >
                    View Video
                  </button>
                ) : (
                  <span className="text-answer">{ans}</span>
                )}
                {analyses[i] && (
                  <button
                    className="show-analysis-btn"
                    onClick={() => setOpenAnalysis(prev => ({ ...prev, [i]: !prev[i] }))}
                  >
                    {openAnalysis[i] ? "Hide Analysis" : "Show Analysis"}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* PER‑VIDEO ANALYSIS */}
        {analyses.map((a, i) =>
          openAnalysis[i] && (
            <section key={i} className="analysis-section">
              <h3>🎥 Analysis for Video #{i + 1}</h3>

              {a.error ? (
                <p style={{ color: "red" }}>Error: {a.error}</p>
              ) : (
                <>
                  {/* Sub‑tab 1: Emotion + Fluency */}
                  <div className="subtab">
                    <h4>🎭 Emotion + Fluency</h4>
                    {Object.entries(a.emotion_results).map(([model,scores]) => (
                      <Plot
                        key={model}
                        data={[{
                          type: "pie",
                          labels: emotionClasses,
                          values: scores.map(x=>x*100),
                        }]}
                        layout={{ width: 350, height: 300, title: model }}
                      />
                    ))}
                    <p><strong>Most Likely:</strong> {a.most_likely_emotion}</p>
                    <p><strong>Fluency Level:</strong> {a.fluent_level}</p>
                    <p><strong>Score:</strong> {a.interview_score_tab1.toFixed(2)} / 10.00</p>
                  </div>

                  {/* Sub‑tab 2: Personality */}
                  <div className="subtab">
                    <h4>🧠 Personality Traits</h4>
                    <Plot
                      data={[{
                        type: "scatterpolar",
                        r: a.personality_scores,
                        theta: traitLabels,
                        fill: "toself"
                      }]}
                      layout={{
                        polar: { radialaxis: { visible:true, range:[0,1] } },
                        width:350, height:300,
                        title:"Radar"
                      }}
                    />
                    <Plot
                      data={[{
                        type: "bar",
                        x: a.personality_scores,
                        y: traitLabels,
                        orientation:"h"
                      }]}
                      layout={{ width:350, height:250, title:"Traits (%)" }}
                    />
                    <p><strong>Score:</strong> {a.interview_score_tab2.toFixed(2)} / 10.00</p>
                  </div>

                  {/* Sub‑tab 3: Text‑Based */}
                  <div className="subtab">
                    <h4>🗣️ Text‑Based Stress & Emotion</h4>
                    <p><strong>Language:</strong> {a.detected_language}</p>
                    <p><strong>Transcript:</strong> {a.transcript}</p>
                    <p><strong>Stress:</strong> {a.stress_detected ? "Yes" : "No"}</p>
                    <p><strong>Emotion:</strong> {a.text_emotion}</p>
                    <p><strong>Score:</strong> {a.interview_score_tab3.toFixed(2)} / 10.00</p>
                  </div>

                  {/* Sub‑tab 4: Facial + Gaze */}
                  <div className="subtab">
                    <h4>😶 Facial Expression & Eye Gaze</h4>

                    <Plot
                      data={[{
                        type: "bar",
                        x: a.emotion_distribution.map(r=>r.Emotions),
                        y: a.emotion_distribution.map(r=>r.Frames)
                      }]}
                      layout={{ width:350, height:280, title:"Emotion Dist." }}
                    />
                    <table className="simple-table">
                      <thead>
                        <tr>
                          <th>Emotion</th><th>Frames</th><th>%</th><th>Dur(s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {a.emotion_distribution.map((r,j)=>(
                          <tr key={j}>
                            <td>{r.Emotions}</td>
                            <td>{r.Frames}</td>
                            <td>{r["Percentage (%)"].toFixed(2)}</td>
                            <td>{r["Duration (seconds)"].toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p><strong>Predominant:</strong> {a.max_emotion}</p>
                    <p><strong>Facial Score:</strong> {a.average_emotion_score.toFixed(2)} / 10.00</p>

                    <Plot
                      data={[{
                        type: "bar",
                        x: a.eye_gaze_distribution.map(r=>r["Eye Gaze"]),
                        y: a.eye_gaze_distribution.map(r=>r.Frames)
                      }]}
                      layout={{ width:350, height:280, title:"Eye Gaze Dist." }}
                    />
                    <table className="simple-table">
                      <thead>
                        <tr>
                          <th>Eye Gaze</th><th>Frames</th><th>%</th><th>Dur(s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {a.eye_gaze_distribution.map((r,j)=>(
                          <tr key={j}>
                            <td>{r["Eye Gaze"]}</td>
                            <td>{r.Frames}</td>
                            <td>{r["Percentage (%)"].toFixed(2)}</td>
                            <td>{r["Duration (seconds)"].toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p><strong>Predominant:</strong> {a.max_eye_gaze}</p>
                    <p><strong>Gaze Score:</strong> {a.final_eye_gaze_score.toFixed(2)} / 10.00</p>
                    <p><strong>Combined:</strong> {a.interview_score_tab4.toFixed(2)} / 10.00</p>
                  </div>
                </>
              )}
            </section>
          )
        )}

        {/* FINAL SCORE */}
        <section className="analysis-section">
          <h3>🏆 Overall Final Score</h3>
          <div className="final-score-box">
            {response.marks != null
              ? response.marks.toFixed(2)
              : "N/A"} / 10.00
          </div>
        </section>

        <div className="back-btn-container">
          <button
            onClick={() => navigate("/recruiter/interview-results")}
            className="back-btn"
          >
            ← Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
