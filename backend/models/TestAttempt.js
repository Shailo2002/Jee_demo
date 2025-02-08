import mongoose from "mongoose";

const questionAttemptSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  selectedAnswer: {
    type: String,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  timeTaken: {
    type: Number, // Time taken in seconds
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const testAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: String,
    required: true,
  },
  testResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestResult",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  questions: [questionAttemptSchema],
  questionTimes: {
    type: Map,
    of: Number, // Store time taken for each question in seconds
  },
  answers: {
    type: Map,
    of: String, // Store user's answers
  },
  correctAnswers: {
    type: Map,
    of: String, // Store correct answers
  },
});

// Add indexes for better query performance
testAttemptSchema.index({ userId: 1, testId: 1 });
testAttemptSchema.index({ testResultId: 1 });

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

export default TestAttempt;
