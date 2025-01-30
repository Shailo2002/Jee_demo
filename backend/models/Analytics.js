import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalTestsTaken: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  subjectWisePerformance: {
    Physics: {
      averageScore: Number,
      averageAccuracy: Number,
      totalAttempted: Number,
      strongTopics: [String],
      weakTopics: [String]
    },
    Chemistry: {
      averageScore: Number,
      averageAccuracy: Number,
      totalAttempted: Number,
      strongTopics: [String],
      weakTopics: [String]
    },
    Mathematics: {
      averageScore: Number,
      averageAccuracy: Number,
      totalAttempted: Number,
      strongTopics: [String],
      weakTopics: [String]
    }
  },
  timeManagement: {
    averageTimePerQuestion: Number,
    averageTestDuration: Number,
    subjectWiseTimeDistribution: {
      Physics: Number,
      Chemistry: Number,
      Mathematics: Number
    }
  },
  improvement: {
    scoreProgress: [{
      date: Date,
      score: Number
    }],
    accuracyProgress: [{
      date: Date,
      accuracy: Number
    }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Analytics', analyticsSchema); 