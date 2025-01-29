import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Target, Brain, TrendingUp } from 'lucide-react';

interface TestResult {
  score: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  questionTimes: Record<number, number>;
  testDate: Date;
  testId: string;
  testTitle: string;
}

interface AnalyticsProps {
  testHistory: TestResult[];
}

const Analytics: React.FC<AnalyticsProps> = ({ testHistory }) => {
  // Calculate average scores by subject
  const subjectScores = {
    Physics: 75,
    Chemistry: 68,
    Mathematics: 82
  };

  // Prepare data for time distribution chart
  const timeDistribution = [
    { name: '0-30 sec', value: 25 },
    { name: '30-60 sec', value: 40 },
    { name: '60-90 sec', value: 20 },
    { name: '90+ sec', value: 15 }
  ];

  // Colors for charts
  const COLORS = ['#3B82F6', '#34D399', '#F87171', '#A78BFA'];

  // Calculate performance metrics
  const averageScore = testHistory.reduce((acc, test) => acc + test.score, 0) / testHistory.length;
  const averageAccuracy = testHistory.reduce((acc, test) => acc + (test.correct / test.attempted) * 100, 0) / testHistory.length;

  return (
    <>
      {/* Analytics Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-blue-100">Track your performance and progress</p>
          
          {/* Quick Stats in Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Average Score</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {averageScore.toFixed(1)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-100" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Accuracy</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {averageAccuracy.toFixed(1)}%
                  </p>
                </div>
                <Brain className="w-8 h-8 text-blue-100" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Tests Taken</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {testHistory.length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-100" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Improvement</p>
                  <p className="text-white text-2xl font-bold mt-1">+12%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Score Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={testHistory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="testTitle" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject-wise Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(subjectScores).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(subjectScores).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Time Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#A78BFA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Improvement Areas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Areas for Improvement</h2>
            <div className="space-y-4">
              {Object.entries(subjectScores).map(([subject, score]) => (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{subject}</span>
                    <span className="text-blue-600 font-medium">{score}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${score}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics; 