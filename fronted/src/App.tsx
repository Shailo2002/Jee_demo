import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TestInterface from "./components/TestInterface";
import Dashboard from "./components/Dashboard";
import TestAnalysis from "./components/TestAnalysis";
import LoginPage from "./components/LoginPage";
import Instructions from "./components/Instructions";

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

interface User {
  id: string;
  name: string;
  email: string;
}

type View = "dashboard" | "instructions" | "test" | "analysis";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState("physics");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [currentTestTitle, setCurrentTestTitle] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleStartTest = (testId: string, testTitle: string) => {
    setSelectedTestId(testId);
    setCurrentTestTitle(testTitle);
    setCurrentView("instructions");
  };

  const handleStartTestFromInstructions = () => {
    setCurrentView("test");
  };

  const handleTestComplete = (result: TestResult) => {
    const newResult = {
      ...result,
      testDate: new Date(),
      testId: selectedTestId!,
      testTitle: currentTestTitle!,
    };
    setSelectedResult(newResult);
    setTestHistory((prev) => [...prev, newResult]);
    setCurrentView("analysis");
  };

  const handleViewTestDetails = (result: TestResult) => {
    setSelectedResult(result);
    setCurrentView("analysis");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedTestId(null);
    setSelectedResult(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setTestHistory([]);
    setCurrentView("dashboard");
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <LoginPage onLogin={handleLogin} isSignUp={false} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isLoggedIn ? (
                <LoginPage onLogin={handleLogin} isSignUp={true} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {currentView === "instructions" && selectedTestId && (
                  <Instructions onProceed={handleStartTestFromInstructions} />
                )}
                {currentView === "test" && selectedTestId && (
                  <TestInterface
                    currentSection={currentSection}
                    onSectionChange={handleSectionChange}
                    onTestComplete={handleTestComplete}
                    testId={selectedTestId}
                    testTitle={currentTestTitle || ""}
                  />
                )}
                {currentView === "analysis" && selectedResult && (
                  <TestAnalysis
                    result={selectedResult}
                    onBackToDashboard={handleBackToDashboard}
                  />
                )}
                {currentView === "dashboard" && (
                  <Dashboard
                    lastTestResult={selectedResult}
                    testHistory={testHistory}
                    onStartTest={handleStartTest}
                    onViewTestDetails={handleViewTestDetails}
                    onLogout={handleLogout}
                    user={user}
                    setUserData={setUser}
                  />
                )}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
