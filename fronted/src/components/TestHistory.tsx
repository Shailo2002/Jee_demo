import React, { useEffect, useState } from "react";
import { Calendar, BookOpen, ChevronRight } from "lucide-react";

interface TestHistoryItem {
  _id: string;
  testId: {
    title: string;
    totalQuestions: number;
  };
  startTime: string;
  endTime: string;
  overallPerformance: {
    score: number;
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
    accuracy: number;
  };
  sectionWisePerformance: {
    subject: string;
    score: number;
    accuracy: number;
  }[];
}

const TestHistory: React.FC = () => {
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestHistory();
  }, []);

  const fetchTestHistory = async () => {
    try {
      const response = await fetch("/api/tests/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setTestHistory(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching test history:", error);
      setLoading(false);
    }
  };

  const getPerformanceStatus = (score: number, total: number) => {
    const percentage = (score / (total * 4)) * 100;
    if (percentage >= 75) return { color: "text-green-500", text: "Excellent" };
    if (percentage >= 60) return { color: "text-blue-500", text: "Good" };
    if (percentage >= 40) return { color: "text-yellow-500", text: "Average" };
    return { color: "text-red-500", text: "Needs Improvement" };
  };

  if (loading) {
    return <div>Loading test history...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Test History</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {testHistory.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No test history available</p>
            <p className="text-sm text-gray-400 mt-1">
              Take your first test to start tracking progress
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {testHistory.map((test) => (
              <div
                key={test._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        {test.testId.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(test.startTime).toLocaleDateString()} -{" "}
                        {new Date(test.endTime).toLocaleTimeString()}
                      </p>
                      <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                        <span>
                          Attempted: {test.overallPerformance.totalAttempted}
                        </span>
                        <span>
                          Correct: {test.overallPerformance.totalCorrect}
                        </span>
                        <span>
                          Accuracy: {test.overallPerformance.accuracy.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {test.overallPerformance.score}/
                        {test.testId.totalQuestions * 4}
                      </div>
                      <div
                        className={`text-xs ${
                          getPerformanceStatus(
                            test.overallPerformance.score,
                            test.testId.totalQuestions
                          ).color
                        }`}
                      >
                        {
                          getPerformanceStatus(
                            test.overallPerformance.score,
                            test.testId.totalQuestions
                          ).text
                        }
                      </div>
                    </div>
                    <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                {/* Subject-wise performance */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {test.sectionWisePerformance.map((section) => (
                    <div
                      key={section.subject}
                      className="text-xs bg-gray-50 p-2 rounded"
                    >
                      <div className="font-medium text-gray-700">
                        {section.subject}
                      </div>
                      <div className="mt-1 text-gray-500">
                        Score: {section.score} | Accuracy: {section.accuracy}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory; 