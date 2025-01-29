import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, HelpCircle, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

interface QuestionPanelProps {
  questionId: number;
  answer: string | null;
  unsavedAnswer: string | null;
  isMarkedForReview: boolean;
  onAnswer: (questionId: number, answer: string) => void;
  onMarkForReview: (questionId: number) => void;
  onSaveAndNext: (questionId: number, answer: string | null) => void;
  onQuestionSelect: (questionId: number) => void;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  questionId,
  answer,
  unsavedAnswer,
  isMarkedForReview,
  onAnswer,
  onMarkForReview,
  onSaveAndNext,
  onQuestionSelect,
}) => {
  // Use the unsaved answer if available, otherwise use the saved answer
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Update selectedAnswer when props change
  useEffect(() => {
    // If there's no answer (cleared) but question is visited, keep selection empty
    if (!answer && !unsavedAnswer) {
      setSelectedAnswer('');
    } else {
      setSelectedAnswer(unsavedAnswer || answer || '');
    }
  }, [unsavedAnswer, answer]);

  // Sample question data - in a real app, this would come from an API
  const question = {
    text: "The dimension of B²/2μ₀, where B is magnetic field and μ₀ is the magnetic permeability of vacuum, is:",
    options: [
      { id: '1', text: 'ML¹T⁻²' },
      { id: '2', text: 'MLT⁻²' },
      { id: '3', text: 'ML⁻¹T⁻²' },
      { id: '4', text: 'ML²T⁻²' }
    ]
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    onAnswer(questionId, optionId);
  };

  const handleSaveAndNext = () => {
    onSaveAndNext(questionId, selectedAnswer);
  };

  const handleClearResponse = () => {
    setSelectedAnswer(''); // Clear the radio button selection
    onAnswer(questionId, ''); // Clear any unsaved answer
    onSaveAndNext(questionId, null); // Remove the answer from parent state
  };

  const handlePrevious = () => {
    if (questionId > 1) {
      onQuestionSelect(questionId - 1);
    }
  };

  const handleNext = () => {
    if (questionId < 75) {
      onQuestionSelect(questionId + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Question Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Question {questionId}</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowUp className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <div className="prose max-w-none mb-6">
          <p className="text-lg">{question.text}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-3 rounded-lg border ${
                selectedAnswer === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } cursor-pointer transition-colors`}
            >
              <input
                type="radio"
                name={`question-${questionId}`}
                value={option.id}
                checked={selectedAnswer === option.id}
                onChange={() => handleOptionSelect(option.id)}
                className="hidden"
              />
              <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full mr-3">
                {selectedAnswer === option.id && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                )}
              </div>
              <span className="text-base">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-4 flex items-center justify-between">
        <div className="flex space-x-3">
          <button 
            onClick={handleClearResponse}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Clear Response
          </button>
          <button
            onClick={() => onMarkForReview(questionId)}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              isMarkedForReview
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>Mark for Review</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePrevious}
            disabled={questionId === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${questionId === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleSaveAndNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              bg-blue-600 text-white hover:bg-blue-700"
          >
            Save & Next
          </button>

          <button
            onClick={handleNext}
            disabled={questionId === 75}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${questionId === 75
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question Status */}
      <div className="border-t border-gray-200 p-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          {selectedAnswer ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : isMarkedForReview ? (
            <HelpCircle className="w-5 h-5 text-purple-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
          <span>
            {selectedAnswer
              ? 'Answered'
              : isMarkedForReview
              ? 'Marked for Review'
              : 'Not Answered'}
          </span>
        </div>
      </div>

      {unsavedAnswer && (
        <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm">
          You have an unsaved answer. Click "Save & Next" to save your response.
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;