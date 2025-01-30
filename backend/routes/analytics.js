import express from "express";
import Analytics from "../models/Analytics.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get user analytics
router.get("/", auth, async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ userId: req.user.id });
    if (!analytics) {
      return res.json({
        totalTestsTaken: 0,
        averageScore: 0,
        subjectWisePerformance: {
          Physics: { averageScore: 0, averageAccuracy: 0, totalAttempted: 0 },
          Chemistry: { averageScore: 0, averageAccuracy: 0, totalAttempted: 0 },
          Mathematics: { averageScore: 0, averageAccuracy: 0, totalAttempted: 0 }
        }
      });
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: "Error fetching analytics" });
  }
});

// Get performance trends
router.get("/trends", auth, async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ userId: req.user.id });
    if (!analytics) {
      return res.json({ scoreProgress: [], accuracyProgress: [] });
    }

    res.json({
      scoreProgress: analytics.improvement.scoreProgress,
      accuracyProgress: analytics.improvement.accuracyProgress
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching trends" });
  }
});

export default router; 