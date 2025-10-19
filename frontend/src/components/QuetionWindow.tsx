import { useState } from "react";
import Header from "./Header";
import Dashboard from "./Dashboard";
import TestInterface from "./TestInterface";

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
}

function QuetionWindow() {
  const [language, setLanguage] = useState("english");
  const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);
  const [currentSection, setCurrentSection] = useState("physics");
  const [isTestCompleted, setIsTestCompleted] = useState(false);

  const handleTestComplete = (result: TestResult) => {
    setLastTestResult({
      ...result,
      testDate: new Date(),
    });
    setIsTestCompleted(true);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header language={language} onLanguageChange={setLanguage} />
      {isTestCompleted ? (
        <Dashboard lastTestResult={lastTestResult} />
      ) : (
        <TestInterface
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onTestComplete={handleTestComplete}
        />
      )}
    </div>
  );
}

export default QuetionWindow;
