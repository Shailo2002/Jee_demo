import mongoose from 'mongoose';

const questionAttemptSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  selectedAnswer: String,
  isCorrect: Boolean,
  timeTaken: Number, // in seconds
  marks: Number // can be positive, negative or zero
});

const sectionPerformanceSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['Physics', 'Chemistry', 'Mathematics'],
    required: true
  },
  attempted: Number,
  correct: Number,
  incorrect: Number,
  score: Number,
  timeTaken: Number, // in seconds
  accuracy: Number
});

const testAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  totalTimeTaken: {
    type: Number, // in seconds
    required: true
  },
  questions: [questionAttemptSchema],
  sectionWisePerformance: [sectionPerformanceSchema],
  overallPerformance: {
    totalAttempted: Number,
    totalCorrect: Number,
    totalIncorrect: Number,
    totalUnattempted: Number,
    score: Number,
    accuracy: Number,
    percentile: Number
  },
  status: {
    type: String,
    enum: ['completed', 'interrupted', 'timed-out'],
    default: 'completed'
  }
});

// Add indexes for better query performance
testAttemptSchema.index({ userId: 1, startTime: -1 });
testAttemptSchema.index({ testId: 1, score: -1 });

export default mongoose.model('TestAttempt', testAttemptSchema); 