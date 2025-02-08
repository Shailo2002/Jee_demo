import mongoose from "mongoose";

const sectionAnalysisSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: false,
  },
  attempted: {
    type: Number,
    default: 0,
    required: false,
  },
  correct: {
    type: Number,
    default: 0,
    required: false,
  },
  incorrect: {
    type: Number,
    default: 0,
    required: false,
  },
  score: {
    type: Number,
    default: 0,
    required: false,
  },
});

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: String,
    required: true,
  },
  testTitle: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  attempted: {
    type: Number,
    required: true,
  },
  correct: {
    type: Number,
    required: true,
  },
  incorrect: {
    type: Number,
    required: true,
  },
  unattempted: {
    type: Number,
    required: true,
  },
  testDate: {
    type: Date,
    default: Date.now,
  },
  totalTime: {
    type: Number, // Total time taken in seconds
    required: true,
  },
  sectionWiseAnalysis: {
    type: [sectionAnalysisSchema],
    default: [], // Make it optional with empty array as default
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better query performance
testResultSchema.index({ userId: 1, testDate: -1 });
testResultSchema.index({ userId: 1, testId: 1 });

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;
