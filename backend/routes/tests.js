import express from "express";
import Test from "../models/Test.js";
import TestAttempt from "../models/TestAttempt.js";
import Analytics from "../models/Analytics.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Start a test attempt
router.post("/start", auth, async (req, res) => {
  try {
    const { testId } = req.body;
    const testAttempt = new TestAttempt({
      userId: req.user.id,
      testId,
      startTime: new Date(),
      status: "started"
    });
    await testAttempt.save();
    res.json({ success: true, attemptId: testAttempt._id });
  } catch (error) {
    res.status(500).json({ error: "Error starting test" });
  }
});

// Submit test attempt
router.post("/submit", auth, async (req, res) => {
  try {
    const {
      testId,
      questions,
      sectionWisePerformance,
      overallPerformance,
      totalTimeTaken
    } = req.body;

    const testAttempt = await TestAttempt.findOneAndUpdate(
      { userId: req.user.id, testId, status: "started" },
      {
        endTime: new Date(),
        questions,
        sectionWisePerformance,
        overallPerformance,
        totalTimeTaken,
        status: "completed"
      },
      { new: true }
    );

    // Update analytics
    await updateAnalytics(req.user.id, testAttempt);

    res.json({ success: true, testAttempt });
  } catch (error) {
    res.status(500).json({ error: "Error submitting test" });
  }
});

// Get test history
router.get("/history", auth, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ userId: req.user.id })
      .sort({ startTime: -1 })
      .populate("testId", "title totalQuestions")
      .limit(10);

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching test history" });
  }
});

// Helper function to update analytics
async function updateAnalytics(userId, testAttempt) {
  try {
    let analytics = await Analytics.findOne({ userId });
    
    if (!analytics) {
      analytics = new Analytics({ userId });
    }

    // Update total tests and average score
    analytics.totalTestsTaken += 1;
    analytics.averageScore = (
      (analytics.averageScore * (analytics.totalTestsTaken - 1) +
        testAttempt.overallPerformance.score) /
      analytics.totalTestsTaken
    );

    // Update subject-wise performance
    testAttempt.sectionWisePerformance.forEach(section => {
      const subjectStats = analytics.subjectWisePerformance[section.subject];
      const totalTests = subjectStats.totalAttempted + 1;
      
      subjectStats.totalAttempted = totalTests;
      subjectStats.averageScore = (
        (subjectStats.averageScore * (totalTests - 1) + section.score) /
        totalTests
      );
      subjectStats.averageAccuracy = (
        (subjectStats.averageAccuracy * (totalTests - 1) + section.accuracy) /
        totalTests
      );
    });

    // Update time management stats
    analytics.timeManagement.averageTestDuration = (
      (analytics.timeManagement.averageTestDuration * (analytics.totalTestsTaken - 1) +
        testAttempt.totalTimeTaken) /
      analytics.totalTestsTaken
    );

    // Update progress arrays
    analytics.improvement.scoreProgress.push({
      date: testAttempt.endTime,
      score: testAttempt.overallPerformance.score
    });

    analytics.improvement.accuracyProgress.push({
      date: testAttempt.endTime,
      accuracy: testAttempt.overallPerformance.accuracy
    });

    analytics.lastUpdated = new Date();
    await analytics.save();
  } catch (error) {
    console.error("Error updating analytics:", error);
  }
}

export default router; 