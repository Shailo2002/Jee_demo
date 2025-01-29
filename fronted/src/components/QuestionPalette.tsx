import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionPaletteProps {
  currentQuestion: number;
  answers: Record<number, string>;
  markedForReview: number[];
  onQuestionSelect: (questionId: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  disabled?: boolean;
  visitedQuestions: number[];
}

const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  currentQuestion,
  answers,
  markedForReview,
  onQuestionSelect,
  isCollapsed,
  onToggleCollapse,
  disabled,
  visitedQuestions
}) => {
  const sections = [
    { name: 'Physics', range: [1, 25] },
    { name: 'Chemistry', range: [26, 50] },
    { name: 'Mathematics', range: [51, 75] }
  ];

  return (
    <div className="fixed right-0 top-[64px] bottom-0 z-40">
      {/* Palette Container with Toggle Button */}
      <div 
        className={`
          relative w-80 h-full transition-transform duration-300 ease-in-out
          ${isCollapsed ? 'translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 p-2.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-l-lg shadow-md transition-colors group"
          title={isCollapsed ? "Show Question Palette" : "Hide Question Palette"}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          )}
        </button>

        {/* Main Content */}
        <div className="h-full bg-white border-l shadow-lg">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">Question Palette</h2>
              <div className="text-sm text-gray-500">
                Question {currentQuestion}/75
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {sections.map((section) => (
                  <div key={section.name} className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center justify-between">
                      <span>{section.name}</span>
                      <span className="text-sm text-gray-500">
                        {section.range[0]}-{section.range[1]}
                      </span>
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from(
                        { length: section.range[1] - section.range[0] + 1 },
                        (_, i) => {
                          const questionNum = section.range[0] + i;
                          const isAnswered = !!answers[questionNum];
                          const isMarked = markedForReview.includes(questionNum);
                          const isVisited = visitedQuestions.includes(questionNum);
                          const isCurrent = currentQuestion === questionNum;

                          // Determine the background color based on answer/visited status
                          let bgColorClass = 'bg-gray-100 text-gray-600'; // default - not visited
                          if (isAnswered) {
                            bgColorClass = 'bg-green-100 text-green-700'; // answered
                          } else if (isVisited) {
                            bgColorClass = 'bg-red-100 text-red-700'; // visited but not answered
                          }

                          return (
                            <button
                              key={questionNum}
                              onClick={() => !disabled && onQuestionSelect(questionNum)}
                              className={`
                                relative p-2 rounded-lg text-center text-sm font-medium
                                transition-all duration-200 hover:scale-105
                                ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:ring-2 hover:ring-blue-300'}
                                ${isCurrent ? 'ring-2 ring-blue-500 shadow-md scale-105' : ''}
                                ${bgColorClass}
                                ${isMarked ? 'ring-2 ring-purple-500' : ''}
                              `}
                              disabled={disabled}
                              title={`Question ${questionNum}${isMarked ? ' (Marked for Review)' : ''}`}
                            >
                              {questionNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 border-t bg-gray-50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-md"></div>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-md"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded-md"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-md ring-2 ring-purple-500"></div>
                  <span>For Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;