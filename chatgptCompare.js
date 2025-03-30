// ✅ Submit Interview Answers
router.post("/interview/:id/submit", upload.array("fileAnswers", 5), async (req, res) => {
  try {
    const candidateId = req.user.id;
    let processedAnswers = [];
    let videoURLs = [];

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // ✅ Check for duplicate submissions
    const existingResponse = interview.responses.find(
      (response) => response.candidate.toString() === candidateId
    );

    if (existingResponse) {
      return res.status(400).json({ message: "You have already submitted answers for this interview." });
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        processedAnswers.push(file.path);
      }
    }

    if (req.body.answers) {
      for (const answer of req.body.answers) {
        processedAnswers.push(answer);
        if (answer.startsWith("http") && answer.includes("video/upload")) {
          videoURLs.push(answer);
        }
      }
    }

    // ✅ Save response
    const newResponse = {
      candidate: candidateId,
      answers: processedAnswers,
      videoMarks: [],
      marks: null,
    };

    interview.responses.push(newResponse);
    await interview.save();

    // ✅ Analyze video responses and calculate marks
    let videoMarks = [];
    for (const url of videoURLs) {
      try {
        const aiRes = await axios.post("http://localhost:5001/analyze-video", { videoURL: url });
        const { marks } = aiRes.data;
        videoMarks.push(marks);
      } catch (err) {
        console.error("❌ AI error:", err.message);
      }
    }

    const avgMark =
      videoMarks.length > 0 ? Math.round(videoMarks.reduce((a, b) => a + b, 0) / videoMarks.length) : null;

    // ✅ Update response with calculated marks
    await Interview.findOneAndUpdate(
      { _id: req.params.id, "responses.candidate": candidateId },
      {
        $set: {
          "responses.$.videoMarks": videoMarks,
          "responses.$.marks": avgMark,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Answers submitted successfully", avgMark });
  } catch (error) {
    console.error("❌ Error submitting answers:", error.message);
    res.status(500).json({ message: "Error submitting answers" });
  }
});
