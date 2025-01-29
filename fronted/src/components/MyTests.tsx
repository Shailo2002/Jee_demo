import React from 'react';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastAttempted?: Date;
}

interface MyTestsProps {
  onStartTest: (testId: string) => void;
}

const MyTests: React.FC<MyTestsProps> = ({ onStartTest }) => {
  const availableTests: Test[] = [
    {
      id: 'test1',
      title: 'JEE Mock Test 1',
      duration: 180,
      totalQuestions: 75,
      subject: 'Physics, Chemistry, Mathematics',
      difficulty: 'Medium'
    },
    {
      id: 'test2',
      title: 'JEE Mock Test 2',
      duration: 180,
      totalQuestions: 75,
      subject: 'Physics, Chemistry, Mathematics',
      difficulty: 'Hard',
      lastAttempted: new Date('2024-03-15')
    },
    {
      id: 'test3',
      title: 'Physics Sectional Test',
      duration: 60,
      totalQuestions: 25,
      subject: 'Physics',
      difficulty: 'Easy'
    },
    {
      id: 'test4',
      title: 'Chemistry Sectional Test',
      duration: 60,
      totalQuestions: 25,
      subject: 'Chemistry',
      difficulty: 'Medium'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      {/* Tests Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white">My Tests</h1>
          <p className="mt-1 text-blue-100">Browse and take practice tests</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Available Tests</h2>
            <p className="mt-1 text-sm text-gray-500">Choose from our collection of practice tests</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {availableTests.map((test) => (
              <div 
                key={test.id}
                className="border border-gray-100 rounded-lg p-6 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{test.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{test.subject}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{test.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>{test.totalQuestions} questions</span>
                      </div>
                      {test.lastAttempted && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Last attempted: {new Date(test.lastAttempted).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center space-x-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartTest(test.id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Test
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTests; 