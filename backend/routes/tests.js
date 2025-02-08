import express from "express";
import { TestResult, TestAttempt } from "../models/index.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/submit", authenticate, async (req, res) => {
  console.log("backend checkpoint");
  try {
    const {
      score,
      attempted,
      correct,
      incorrect,
      unattempted,
      questionTimes,
      answers,
      correctAnswers,
      testId,
      testTitle,
      totalTime,
      sectionWiseAnalysis,
    } = req.body;

    // Handle sectionWiseAnalysis - ensure it's an array or use empty array
    let formattedSectionAnalysis = [];
    if (Array.isArray(sectionWiseAnalysis)) {
      formattedSectionAnalysis = sectionWiseAnalysis.map((section) => ({
        sectionName: section.sectionName || "Unknown Section",
        attempted: section.attempted || 0,
        correct: section.correct || 0,
        incorrect: section.incorrect || 0,
        score: section.score || 0,
      }));
    }

    // Create TestResult document
    const testResult = new TestResult({
      userId: req.user._id,
      testId,
      testTitle,
      score,
      attempted,
      correct,
      incorrect,
      unattempted,
      totalTime,
      sectionWiseAnalysis: formattedSectionAnalysis, // Use the formatted array
    });
    console.log("testResult", testResult);
    await testResult.save();

    // Create TestAttempt document
    const testAttempt = new TestAttempt({
      userId: req.user._id,
      testId,
      testResultId: testResult._id,
      startTime: new Date(Date.now() - totalTime * 1000),
      endTime: new Date(),
      questions: Object.entries(answers).map(([qNum, answer]) => ({
        questionNumber: parseInt(qNum),
        selectedAnswer: answer,
        correctAnswer: correctAnswers[qNum],
        timeTaken: questionTimes[qNum] || 0,
        isCorrect: answer === correctAnswers[qNum],
      })),
      questionTimes,
      answers,
      correctAnswers,
    });

    await testAttempt.save();
    console.log("final check");
    res.status(201).json({
      message: "Test result saved successfully",
      testResultId: testResult._id,
    });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ error: "Failed to save test result" });
  }
});

export default router;
