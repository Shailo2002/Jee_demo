import React, { useState } from 'react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  questionTimes?: Record<number, number>;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  score,
  totalQuestions,
  attempted,
  correct,
  incorrect,
  unattempted,
  questionTimes = {}
}) => {
  const [showTimes, setShowTimes] = useState(false);
  
  if (!isOpen) return null;

  const scoreColor = score >= 0 ? 'text-blue-600' : 'text-red-600';
  const scoreBgColor = score >= 0 ? 'bg-blue-50' : 'bg-red-50';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const totalTime = Object.values(questionTimes).reduce((sum, time) => sum + time, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Test Result</h2>
        
        <div className="space-y-4">
          <div className={`${scoreBgColor} p-4 rounded-lg`}>
            <h3 className={`text-xl font-semibold ${scoreColor}`}>Total Score</h3>
            <p className={`text-3xl font-bold ${scoreColor}`}>{score} / 300</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-lg font-semibold">{totalQuestions}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-lg font-semibold">{formatTime(totalTime)}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-600">Correct</p>
              <p className="text-lg font-semibold text-green-700">{correct}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-red-600">Incorrect</p>
              <p className="text-lg font-semibold text-red-700">{incorrect}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Unattempted Questions</p>
            <p className="text-lg font-semibold">{unattempted}</p>
          </div>

          <button
            onClick={() => setShowTimes(!showTimes)}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
          >
            {showTimes ? 'Hide Question Times' : 'Show Question Times'}
          </button>

          {showTimes && (
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left">Question</th>
                    <th className="py-2 px-4 text-right">Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(qNum => (
                    <tr key={qNum} className="border-t">
                      <td className="py-2 px-4">Question {qNum}</td>
                      <td className="py-2 px-4 text-right">
                        {questionTimes[qNum] ? formatTime(questionTimes[qNum]) : 'Not visited'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal; 