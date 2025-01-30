import React, { useEffect, useState } from "react";
import { TrendingUp, Clock, Target, Award } from "lucide-react";

interface AnalyticsData {
  totalTestsTaken: number;
  averageScore: number;
  subjectWisePerformance: {
    Physics: SubjectStats;
    Chemistry: SubjectStats;
    Mathematics: SubjectStats;
  };
  timeManagement: {
    averageTimePerQuestion: number;
    averageTestDuration: number;
  };
}

interface SubjectStats {
  averageScore: number;
  averageAccuracy: number;
  totalAttempted: number;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setAnalyticsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!analyticsData) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Tests Taken</h3>
            <Target className="text-blue-500 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{analyticsData.totalTestsTaken}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Average Score</h3>
            <Award className="text-green-500 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">
            {analyticsData.averageScore.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Avg Time/Test</h3>
            <Clock className="text-purple-500 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">
            {Math.round(analyticsData.timeManagement.averageTestDuration / 60)}m
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Progress</h3>
            <TrendingUp className="text-orange-500 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">+12%</p>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-6">Subject-wise Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(analyticsData.subjectWisePerformance).map(
            ([subject, stats]) => (
              <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-4">{subject}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Score</span>
                      <span className="font-medium">
                        {stats.averageScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${stats.averageScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy</span>
                      <span className="font-medium">
                        {stats.averageAccuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${stats.averageAccuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Tests Attempted: {stats.totalAttempted}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
