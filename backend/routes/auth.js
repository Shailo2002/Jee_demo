import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import TestHistory from "../models/TestHistory.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(fullName, email, password);
    // Create new user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("check in login");
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("we ARE HERE 1");

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update test history endpoints
router.post("/save-test-history", auth, async (req, res) => {
  try {
    const { testName, score, totalQuestions } = req.body;
    const testHistory = new TestHistory({
      userId: req.user.id,
      testName,
      score,
      totalQuestions,
    });
    await testHistory.save();
    res.json({ success: true, testHistory });
  } catch (error) {
    res.status(500).json({ error: "Error saving test history" });
  }
});

router.get("/test-history", auth, async (req, res) => {
  try {
    const testHistory = await TestHistory.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(10);
    res.json(testHistory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching test history" });
  }
});

export default router;
