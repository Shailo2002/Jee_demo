import React, { useState, useEffect } from "react";
import { Timer, AlertCircle, Clock } from "lucide-react";
import QuestionPanel from "./QuestionPanel";
import QuestionPalette from "./QuestionPalette";
import ResultModal from "./ResultModal";
import axios from "axios";
import { Backend_URL } from "../contant";
import { useLocation } from "react-router-dom";

interface TestResult {
  score: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  questionTimes: Record<number, number>;
  answers?: Record<number, string>;
  correctAnswers?: Record<number, string>;
  testDate: Date;
  testId: string;
  testTitle: string;
}

interface TestInterfaceProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onTestComplete: (result: TestResult) => void;
  testId: string;
  testTitle: string;
}

const TestInterface: React.FC<TestInterfaceProps> = ({
  currentSection,
  onSectionChange,
  onTestComplete,
  testId,
  testTitle,
}) => {
  console.log("TestInterface Props - testId:", testId);
  console.log("TestInterface Props - testTitle:", testTitle);

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`test_${testId}_timeLeft`);
    return savedTime ? parseInt(savedTime) : 180 * 60;
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const savedAnswers = localStorage.getItem(`test_${testId}_answers`);
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [markedForReview, setMarkedForReview] = useState<number[]>(() => {
    const savedMarked = localStorage.getItem(`test_${testId}_markedForReview`);
    return savedMarked ? JSON.parse(savedMarked) : [];
  });
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
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>(() => {
    const savedVisited = localStorage.getItem(
      `test_${testId}_visitedQuestions`
    );
    return savedVisited ? JSON.parse(savedVisited) : [];
  });
  const [unsavedAnswer, setUnsavedAnswer] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [attemptedNavigation, setAttemptedNavigation] = useState<number | null>(
    null
  );

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
      setVisitedQuestions((prev) => [...prev, currentQuestion]);
    }

    // Start timing for the current question
    const startTime = Date.now();
    const questionTime = testResult.questionTimes[currentQuestion] || 0;

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0) {
        setTestResult((prev) => ({
          ...prev,
          questionTimes: {
            ...prev.questionTimes,
            [currentQuestion]: questionTime + timeSpent, // Accumulate time
          },
        }));
      }
    };
  }, [currentQuestion, isTestSubmitted]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_timeLeft`, timeLeft.toString());
  }, [timeLeft, testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_answers`, JSON.stringify(answers));
  }, [answers, testId]);

  useEffect(() => {
    localStorage.setItem(
      `test_${testId}_markedForReview`,
      JSON.stringify(markedForReview)
    );
  }, [markedForReview, testId]);

  useEffect(() => {
    localStorage.setItem(
      `test_${testId}_visitedQuestions`,
      JSON.stringify(visitedQuestions)
    );
  }, [visitedQuestions, testId]);

  useEffect(() => {
    // Ensure the test view stays active
    localStorage.setItem("currentView", "test");

    // Cleanup function
    return () => {
      // Only clean up if the test is submitted
      if (isTestSubmitted) {
        localStorage.removeItem("currentView");
        localStorage.removeItem("selectedTestId");
        localStorage.removeItem("currentTestTitle");
      }
    };
  }, [isTestSubmitted]);

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
    setMarkedForReview((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
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
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      setUnsavedAnswer(null);
    }
    setCurrentQuestion((prev) => (prev === 75 ? 1 : prev + 1));
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
      setAnswers((prev) => ({ ...prev, [currentQuestion]: unsavedAnswer }));
      setCurrentQuestion(attemptedNavigation);

      // Determine and set section based on question number
      const section = getCurrentSection(attemptedNavigation);
      onSectionChange(section);
      localStorage.setItem(`test_${testId}_currentSection`, section);
    } else if (!shouldSave && attemptedNavigation) {
      setCurrentQuestion(attemptedNavigation);

      // Determine and set section based on question number
      const section = getCurrentSection(attemptedNavigation);
      onSectionChange(section);
      localStorage.setItem(`test_${testId}_currentSection`, section);
    }
    setUnsavedAnswer(null);
    setShowWarning(false);
    setAttemptedNavigation(null);
  };

  const handleSubmitTest = async () => {
    if (isTestSubmitted) return;

    console.log("Submitting test with ID:", testId);
    console.log("Submitting test with Title:", testTitle);

    // Calculate time for the last question
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    if (timeSpent > 0) {
      setTestResult((prev) => ({
        ...prev,
        questionTimes: {
          ...prev.questionTimes,
          [currentQuestion]:
            (prev.questionTimes[currentQuestion] || 0) + timeSpent,
        },
      }));
    }

    // Initialize counters
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;
    let unattempted = 0;

    // Calculate section-wise analysis
    const sectionWiseAnalysis = {
      Physics: {
        score: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        timeSpent: 0,
      },
      Chemistry: {
        score: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        timeSpent: 0,
      },
      Mathematics: {
        score: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        timeSpent: 0,
      },
    };

    // Set all correct answers to '2' (option B)
    const correctAnswers: Record<number, string> = {};
    for (let i = 1; i <= 75; i++) {
      correctAnswers[i] = "2";
    }

    // Calculate scores and section-wise analysis
    for (let i = 1; i <= 75; i++) {
      const section =
        i <= 25 ? "Physics" : i <= 50 ? "Chemistry" : "Mathematics";
      const sectionData = sectionWiseAnalysis[section];

      if (answers[i]) {
        attempted++;
        if (answers[i] === "2") {
          score += 4;
          correct++;
          sectionData.score += 4;
          sectionData.correct++;
        } else {
          score -= 1;
          incorrect++;
          sectionData.score -= 1;
          sectionData.incorrect++;
        }
      } else {
        unattempted++;
        sectionData.unattempted++;
      }

      // Add time spent to section
      sectionData.timeSpent += testResult.questionTimes[i] || 0;
    }

    // Calculate total time spent
    const totalTime = Object.values(testResult.questionTimes).reduce(
      (sum, time) => sum + time,
      0
    );

    const result = {
      score,
      attempted,
      correct,
      incorrect,
      unattempted,
      questionTimes: testResult.questionTimes,
      answers,
      correctAnswers,
      testId: testId,
      testTitle: testTitle,
      totalTime,
      sectionWiseAnalysis,
      testDate: new Date(),
    };

    try {
      // Send the test result to the backend
      const response = await axios.post(
        `${Backend_URL}/api/tests/submit`,
        // "http://localhost:5000/api/tests/submit",
        result,
        {
          headers: {
            "Content-Type": "application/json",
            // Add your authentication token here if required
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Test result saved successfully");
        setTestResult(result);
        setShowResult(true);
        setIsTestSubmitted(true);
        onTestComplete(result);
        cleanupLocalStorage();
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      // You might want to show an error message to the user
      // For example, using a toast notification
    }
  };

  const cleanupLocalStorage = () => {
    localStorage.removeItem(`test_${testId}_timeLeft`);
    localStorage.removeItem(`test_${testId}_answers`);
    localStorage.removeItem(`test_${testId}_markedForReview`);
    localStorage.removeItem(`test_${testId}_visitedQuestions`);
    localStorage.removeItem(`test_${testId}_currentView`);
    localStorage.removeItem(`test_${testId}_currentSection`);
  };

  useEffect(() => {
    return () => {
      if (isTestSubmitted) {
        cleanupLocalStorage();
      }
    };
  }, [isTestSubmitted, testId]);

  // Helper function to get current section based on question number
  const getCurrentSection = (questionNum: number) => {
    if (questionNum >= 1 && questionNum <= 25) return "physics";
    if (questionNum >= 26 && questionNum <= 50) return "chemistry";
    if (questionNum >= 51 && questionNum <= 75) return "maths";
    return "physics"; // default
  };

  // Modified section change handler with better state management
  const handleSectionChange = (section: string) => {
    if (unsavedAnswer) {
      setShowWarning(true);
      const questionMap = {
        physics: 1,
        chemistry: 26,
        maths: 51,
      };
      setAttemptedNavigation(questionMap[section as keyof typeof questionMap]);
      return;
    }

    // Save current view in localStorage
    localStorage.setItem(`test_${testId}_currentView`, "test");
    localStorage.setItem(`test_${testId}_currentSection`, section);

    const questionMap = {
      physics: 1,
      chemistry: 26,
      maths: 51,
    };

    const targetQuestion = questionMap[section as keyof typeof questionMap];
    setCurrentQuestion(targetQuestion); // Directly set current question instead of using handleQuestionSelect
    onSectionChange(section);
  };

  // Add useEffect to handle initial section and view restoration
  useEffect(() => {
    const savedView = localStorage.getItem(`test_${testId}_currentView`);
    const savedSection = localStorage.getItem(`test_${testId}_currentSection`);

    if (savedView === "test" && savedSection) {
      onSectionChange(savedSection);
      const questionMap = {
        physics: 1,
        chemistry: 26,
        maths: 51,
      };
      setCurrentQuestion(questionMap[savedSection as keyof typeof questionMap]);
    }
  }, [testId]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div
        className={`flex-1 bg-gray-50 ${
          isPaletteCollapsed ? "" : "mr-[320px]"
        }`}
      >
        {/* Top Navigation Bar */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Navigation */}
            <div className="border-b">
              <div className="px-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <nav className="flex flex-wrap justify-center gap-2 py-2 w-full sm:w-auto">
                  {["physics", "chemistry", "maths"].map((section) => {
                    const isCurrentSection =
                      getCurrentSection(currentQuestion) === section;
                    return (
                      <button
                        key={section}
                        onClick={() => handleSectionChange(section)}
                        className={`
                          px-4 sm:px-8 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base
                          ${
                            isCurrentSection
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100"
                          }
                          ${
                            isTestSubmitted
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                          flex-1 sm:flex-none
                        `}
                        disabled={isTestSubmitted}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </button>
                    );
                  })}
                </nav>

                {/* Timer */}
                <div className="flex items-center space-x-4 py-2 w-full sm:w-auto justify-center sm:justify-end">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-semibold text-gray-700">
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  {/* Add Submit Test Button */}
                  <button
                    onClick={handleSubmitTest}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        isTestSubmitted
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : timeLeft < 300
                          ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }
                    `}
                    disabled={isTestSubmitted}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
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
                  You have selected an answer but haven't saved it. Would you
                  like to save before moving to another question?
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
