import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    id: String,
    text: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['Physics', 'Chemistry', 'Mathematics'],
    required: true
  },
  marks: {
    type: Number,
    default: 4
  },
  negativeMark: {
    type: Number,
    default: -1
  }
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: {
    type: Number, // in minutes
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  questions: [questionSchema],
  subjectWiseDistribution: {
    Physics: Number,
    Chemistry: Number,
    Mathematics: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Test', testSchema); 