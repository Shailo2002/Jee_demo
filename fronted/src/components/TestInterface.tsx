import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';
import QuestionPanel from './QuestionPanel';
import QuestionPalette from './QuestionPalette';
import ResultModal from './ResultModal';

interface TestInterfaceProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onTestComplete: (result: TestResult) => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ currentSection, onSectionChange, onTestComplete }) => {
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [testResult, setTestResult] = useState({
    score: 0,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    questionTimes: {} as Record<number, number>,
  });
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);
  const [unsavedAnswer, setUnsavedAnswer] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [attemptedNavigation, setAttemptedNavigation] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTestSubmitted) {
      setTimeLeft(0); // Stop the timer
    }
  }, [isTestSubmitted]);

  useEffect(() => {
    if (isTestSubmitted) return; // Do not track time if the test is submitted

    // Mark the current question as visited
    if (!visitedQuestions.includes(currentQuestion)) {
      setVisitedQuestions(prev => [...prev, currentQuestion]);
    }

    // Start timing for the current question
    const startTime = Date.now();
    const questionTime = testResult.questionTimes[currentQuestion] || 0;

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0) {
        setTestResult(prev => ({
          ...prev,
          questionTimes: {
            ...prev.questionTimes,
            [currentQuestion]: questionTime + timeSpent // Accumulate time
          }
        }));
      }
    };
  }, [currentQuestion, isTestSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleAnswer = (questionId: number, answer: string) => {
    if (isTestSubmitted) return;
    setUnsavedAnswer(answer);
  };

  const handleMarkForReview = (questionId: number) => {
    if (isTestSubmitted) return; // Prevent interaction if the test is submitted
    setMarkedForReview(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSaveAndNext = (questionId: number, answer: string | null) => {
    if (isTestSubmitted) return;
    
    // If answer is null (from clear response), just remove it from answers
    if (answer === null) {
      const newAnswers = { ...answers };
      delete newAnswers[questionId]; // This removes the answer completely
      setAnswers(newAnswers);
      setUnsavedAnswer(null);
      return; // Don't navigate to next question when clearing
    }

    // Normal save and next behavior
    if (answer) {
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
      setUnsavedAnswer(null);
    }
    setCurrentQuestion(prev => prev === 75 ? 1 : prev + 1);
  };

  const handleQuestionSelect = (questionId: number) => {
    if (unsavedAnswer) {
      setShowWarning(true);
      setAttemptedNavigation(questionId);
      return;
    }
    setCurrentQuestion(questionId);
  };

  const handleWarningResponse = (shouldSave: boolean) => {
    if (shouldSave && unsavedAnswer && attemptedNavigation) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: unsavedAnswer }));
      setCurrentQuestion(attemptedNavigation);
    } else if (!shouldSave && attemptedNavigation) {
      setCurrentQuestion(attemptedNavigation);
    }
    setUnsavedAnswer(null);
    setShowWarning(false);
    setAttemptedNavigation(null);
  };

  const handleSubmitTest = () => {
    if (isTestSubmitted) return;

    // Calculate time for the last question
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    if (timeSpent > 0) {
      setTestResult(prev => ({
        ...prev,
        questionTimes: {
          ...prev.questionTimes,
          [currentQuestion]: (prev.questionTimes[currentQuestion] || 0) + timeSpent
        }
      }));
    }

    // Initialize counters
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;
    let unattempted = 0;

    // Set all correct answers to '2' (option B)
    const correctAnswers: Record<number, string> = {};
    for (let i = 1; i <= 75; i++) {
      correctAnswers[i] = '2';
    }

    // Calculate score
    for (let i = 1; i <= 75; i++) {
      if (answers[i]) {
        attempted++;
        if (answers[i] === '2') { // Check if the answer is 'B' (2)
          score += 4;
          correct++;
        } else {
          score -= 1;
          incorrect++;
        }
      } else {
        unattempted++;
      }
    }

    const result = {
      score,
      attempted,
      correct,
      incorrect,
      unattempted,
      questionTimes: testResult.questionTimes,
      answers,
      correctAnswers,
    };

    setTestResult(result);
    setShowResult(true);
    setIsTestSubmitted(true);
    onTestComplete(result);
  };

  // Helper function to get current section based on question number
  const getCurrentSection = (questionNum: number) => {
    if (questionNum >= 1 && questionNum <= 25) return 'physics';
    if (questionNum >= 26 && questionNum <= 50) return 'chemistry';
    if (questionNum >= 51 && questionNum <= 75) return 'maths';
    return 'physics'; // default
  };

  // Modified section change handler
  const handleSectionChange = (section: string) => {
    const questionMap = {
      'physics': 1,
      'chemistry': 26,
      'maths': 51
    };
    
    const targetQuestion = questionMap[section as keyof typeof questionMap];
    handleQuestionSelect(targetQuestion);
    onSectionChange(section);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className={`flex-1 bg-gray-50 ${isPaletteCollapsed ? '' : 'mr-[320px]'}`}>
        {/* Top Navigation Bar */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Navigation */}
            <div className="border-b">
              <div className="px-4 flex items-center justify-between">
                <nav className="flex space-x-1 py-2">
                  {['physics', 'chemistry', 'maths'].map((section) => {
                    const isCurrentSection = getCurrentSection(currentQuestion) === section;
                    return (
                      <button
                        key={section}
                        onClick={() => handleSectionChange(section)}
                        className={`
                          px-8 py-2.5 rounded-lg font-medium transition-all
                          ${isCurrentSection
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                          ${isTestSubmitted ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={isTestSubmitted}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </button>
                    );
                  })}
                </nav>

                {/* Timer */}
                <div className="flex items-center gap-2 py-2">
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    ${timeLeft < 300 ? 'bg-red-50' : 'bg-gray-50'}
                  `}>
                    <Timer 
                      className={`w-5 h-5 ${
                        timeLeft < 300 
                          ? 'text-red-600 animate-pulse' 
                          : 'text-gray-600'
                      }`} 
                    />
                    <span className={`
                      font-mono font-medium text-lg
                      ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}
                    `}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  <button
                    onClick={handleSubmitTest}
                    className={`
                      px-6 py-2 rounded-lg font-medium transition-colors
                      ${isTestSubmitted 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                      }
                    `}
                    disabled={isTestSubmitted}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto p-6">
              {/* Warning Modal */}
              {showWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-lg font-semibold">Unsaved Answer</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      You have selected an answer but haven't saved it. Would you like to save before moving to another question?
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleWarningResponse(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Don't Save
                      </button>
                      <button
                        onClick={() => handleWarningResponse(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save & Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Panel */}
              <div className="bg-white rounded-xl shadow-sm">
                <QuestionPanel
                  questionId={currentQuestion}
                  answer={answers[currentQuestion]}
                  unsavedAnswer={unsavedAnswer}
                  isMarkedForReview={markedForReview.includes(currentQuestion)}
                  onAnswer={handleAnswer}
                  onMarkForReview={handleMarkForReview}
                  onSaveAndNext={handleSaveAndNext}
                  onQuestionSelect={handleQuestionSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Palette */}
        <QuestionPalette
          currentQuestion={currentQuestion}
          answers={answers}
          markedForReview={markedForReview}
          onQuestionSelect={handleQuestionSelect}
          isCollapsed={isPaletteCollapsed}
          onToggleCollapse={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
          disabled={isTestSubmitted}
          visitedQuestions={visitedQuestions}
        />

        {/* Result Modal */}
        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          score={testResult.score}
          totalQuestions={75}
          attempted={testResult.attempted}
          correct={testResult.correct}
          incorrect={testResult.incorrect}
          unattempted={testResult.unattempted}
          questionTimes={testResult.questionTimes}
        />
      </div>
    </div>
  );
};

export default TestInterface;