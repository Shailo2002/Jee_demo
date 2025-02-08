import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: String,
    required: true
  },
  testTitle: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  attempted: {
    type: Number,
    required: true
  },
  correct: {
    type: Number,
    required: true
  },
  incorrect: {
    type: Number,
    required: true
  },
  unattempted: {
    type: Number,
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  totalTime: {
    type: Number,  // Total time taken in seconds
    required: true
  },
  sectionWiseAnalysis: {
    Physics: {
      score: Number,
      correct: Number,
      incorrect: Number,
      unattempted: Number,
      timeSpent: Number  // in seconds
    },
    Chemistry: {
      score: Number,
      correct: Number,
      incorrect: Number,
      unattempted: Number,
      timeSpent: Number
    },
    Mathematics: {
      score: Number,
      correct: Number,
      incorrect: Number,
      unattempted: Number,
      timeSpent: Number
    }
  }
});

// Add indexes for better query performance
testResultSchema.index({ userId: 1, testDate: -1 });
testResultSchema.index({ userId: 1, testId: 1 });

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult; 