import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Test {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  subject: string;
  status?: 'draft' | 'active';
}

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  subject: string;
}

// Add new interface for bulk questions
interface BulkQuestions {
  questions: Question[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddQuestions, setShowAddQuestions] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [bulkQuestionsInput, setBulkQuestionsInput] = useState("");

  // Modified test form state to include questions array
  const [testForm, setTestForm] = useState<Test & { questions?: Question[] }>({
    id: "",
    title: "",
    duration: 180,
    totalQuestions: 75,
    subject: "Physics, Chemistry, Mathematics",
    questions: [],
    status: 'draft',
  });

  const [questionForm, setQuestionForm] = useState<Question>({
    id: "",
    text: "",
    options: [
      { id: "1", text: "" },
      { id: "2", text: "" },
      { id: "3", text: "" },
      { id: "4", text: "" },
    ],
    correctAnswer: "",
    subject: "Physics",
  });

  // Add new state to store all questions for the selected test
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"dashboard" | "tests" | "settings">("dashboard");

  const stats = [
    {
      title: "Total Tests",
      value: tests.length,
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Tests",
      value: tests.filter(t => t.status === 'active').length,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Draft Tests",
      value: tests.filter(t => t.status !== 'active').length,
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-50",
    },
  ];

  // Fetch tests on component mount
  useEffect(() => {
    // TODO: Fetch tests from backend
    // const fetchTests = async () => {
    //   const response = await fetch('/api/admin/tests');
    //   const data = await response.json();
    //   setTests(data);
    // };
    // fetchTests();
  }, []);

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTest = {
        ...testForm,
        id: Date.now().toString(),
        questions: JSON.parse(bulkQuestionsInput || '[]'),
        status: 'draft' as const,
      };
      setTests([...tests, newTest]);
      setShowAddTest(false);
      setTestForm({
        id: "",
        title: "",
        duration: 180,
        totalQuestions: 75,
        subject: "Physics, Chemistry, Mathematics",
        questions: [],
        status: 'draft',
      });
      setBulkQuestionsInput("");
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  const handleEditQuestions = (test: Test & { questions?: Question[] }) => {
    setSelectedTest(test);
    setShowAddQuestions(true);
    if (test.questions && test.questions.length > 0) {
      setTestQuestions(test.questions);
      setQuestionForm(test.questions[0]);
      setCurrentQuestion(1);
    } else {
      setTestQuestions([]);
      setQuestionForm({
        id: "",
        text: "",
        options: [
          { id: "1", text: "" },
          { id: "2", text: "" },
          { id: "3", text: "" },
          { id: "4", text: "" },
        ],
        correctAnswer: "",
        subject: "Physics",
      });
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedQuestions = [...testQuestions];
      updatedQuestions[currentQuestion - 1] = questionForm;
      setTestQuestions(updatedQuestions);

      // Update the test in the tests array
      if (selectedTest) {
        const updatedTests = tests.map(test => 
          test.id === selectedTest.id 
            ? { ...test, questions: updatedQuestions }
            : test
        );
        setTests(updatedTests);
      }

      if (currentQuestion < 75) {
        setCurrentQuestion(prev => prev + 1);
        // Load next question if it exists, otherwise clear the form
        if (testQuestions[currentQuestion]) {
          setQuestionForm(testQuestions[currentQuestion]);
        } else {
          setQuestionForm({
            id: "",
            text: "",
            options: [
              { id: "1", text: "" },
              { id: "2", text: "" },
              { id: "3", text: "" },
              { id: "4", text: "" },
            ],
            correctAnswer: "",
            subject: "Physics",
          });
        }
      } else {
        setShowAddQuestions(false);
        setSelectedTest(null);
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleQuestionNavigation = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    if (testQuestions[questionNumber - 1]) {
      setQuestionForm(testQuestions[questionNumber - 1]);
    }
  };

  const handleLaunchTest = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    const isLaunching = test?.status !== 'active';
    
    const message = isLaunching
      ? "Are you sure you want to launch this test? Once launched, it will be visible to students."
      : "Are you sure you want to unpublish this test? Students won't be able to access it anymore.";
    
    if (window.confirm(message)) {
      setTests(tests.map(test => 
        test.id === testId 
          ? { ...test, status: test.status === 'active' ? 'draft' : 'active' }
          : test
      ));
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      const test = tests.find(t => t.id === testId);
      if (test?.status === 'active') {
        alert('Cannot delete an active test. Please unpublish it first.');
        return;
      }

      if (window.confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
        setTests(tests.filter(test => test.id !== testId));
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  // Add function to parse bulk questions
  const handleBulkQuestionsInput = (input: string) => {
    try {
      const parsedQuestions = JSON.parse(input);
      if (Array.isArray(parsedQuestions)) {
        setTestForm({
          ...testForm,
          questions: parsedQuestions,
        });
      }
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  };

  // Modify the test form JSX to include bulk questions input
  const renderAddTestForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Test</h2>
      <form onSubmit={handleTestSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={testForm.title}
            onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            value={testForm.duration}
            onChange={(e) => setTestForm({ ...testForm, duration: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            value={testForm.subject}
            onChange={(e) => setTestForm({ ...testForm, subject: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bulk Questions Input (JSON format)
          </label>
          <div className="mt-1 text-sm text-gray-500">
            Paste an array of questions in JSON format
          </div>
          <textarea
            value={bulkQuestionsInput}
            onChange={(e) => {
              setBulkQuestionsInput(e.target.value);
              handleBulkQuestionsInput(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={10}
            placeholder={`[
  {
    "text": "Question text here",
    "options": [
      { "id": "1", "text": "Option 1" },
      { "id": "2", "text": "Option 2" },
      { "id": "3", "text": "Option 3" },
      { "id": "4", "text": "Option 4" }
    ],
    "correctAnswer": "1",
    "subject": "Physics"
  }
]`}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowAddTest(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Test
          </button>
        </div>
      </form>
    </div>
  );

  // Modify the test list to show Edit Questions instead of Add Questions
  const renderTestList = () => (
    <div className="space-y-6">
      {/* Active Tests */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Tests</h2>
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
            {tests.filter(t => t.status === 'active').length} Tests Live
          </span>
        </div>
        <div className="space-y-4">
          {tests
            .filter(test => test.status === 'active')
            .map((test) => (
              <div
                key={test.id}
                className="border border-green-100 rounded-lg p-4 flex justify-between items-center bg-green-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{test.title}</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Live
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Duration: {test.duration} mins | Questions: {test.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">Subjects: {test.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditQuestions(test)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit Questions
                  </button>
                  <button
                    onClick={() => handleLaunchTest(test.id)}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition"
                  >
                    Unpublish
                  </button>
                </div>
              </div>
            ))}
          {tests.filter(t => t.status === 'active').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No active tests</p>
              <p className="text-sm text-gray-400 mt-1">Launch a test to make it visible to students</p>
            </div>
          )}
        </div>
      </div>

      {/* Draft Tests */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Draft Tests</h2>
          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
            {tests.filter(t => t.status !== 'active').length} Drafts
          </span>
        </div>
        <div className="space-y-4">
          {tests
            .filter(test => test.status !== 'active')
            .map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{test.title}</h3>
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                      Draft
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Duration: {test.duration} mins | Questions: {test.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">Subjects: {test.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditQuestions(test)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit Questions
                  </button>
                  <button
                    onClick={() => handleLaunchTest(test.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
                  >
                    Launch Test
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          {tests.filter(t => t.status !== 'active').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No draft tests</p>
              <p className="text-sm text-gray-400 mt-1">Create a new test to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Modify the questions form to show navigation between questions
  const renderQuestionsForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Edit Questions for {selectedTest?.title}
        </h2>
        <div className="text-sm text-gray-600">
          Question {currentQuestion}/75
        </div>
      </div>

      {/* Add question navigation */}
      <div className="flex justify-center space-x-2 mb-6">
        <button
          onClick={() => handleQuestionNavigation(Math.max(1, currentQuestion - 1))}
          disabled={currentQuestion === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          {testQuestions[currentQuestion - 1] ? "✓" : "○"}
        </span>
        <button
          onClick={() => handleQuestionNavigation(Math.min(75, currentQuestion + 1))}
          disabled={currentQuestion === 75}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Existing question form */}
      <form onSubmit={handleQuestionSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Question Text</label>
          <textarea
            value={questionForm.text}
            onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
            required
          />
        </div>
        {questionForm.options.map((option, index) => (
          <div key={option.id}>
            <label className="block text-sm font-medium text-gray-700">
              Option {option.id}
            </label>
            <input
              type="text"
              value={option.text}
              onChange={(e) => {
                const newOptions = [...questionForm.options];
                newOptions[index].text = e.target.value;
                setQuestionForm({ ...questionForm, options: newOptions });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
          <select
            value={questionForm.correctAnswer}
            onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select correct option</option>
            {questionForm.options.map((option) => (
              <option key={option.id} value={option.id}>
                Option {option.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setShowAddQuestions(false);
              setSelectedTest(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {currentQuestion === 75 ? "Finish" : "Next Question"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left Section - Logo & Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Indian_Institute_of_Technology_Roorkee_Logo.svg/1920px-Indian_Institute_of_Technology_Roorkee_Logo.svg.png"
                  alt="IIT Roorkee"
                  className="h-10 w-10 object-contain mr-3"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900">
                    Admin Portal
                  </span>
                  <span className="text-xs text-gray-500">
                    Test Management System
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden md:block ml-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddTest(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent 
                text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 transition-colors w-auto max-w-[200px]"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Test
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`flex items-center w-full px-4 py-2 text-left rounded-lg transition ${
                    currentView === "dashboard"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView("tests")}
                  className={`flex items-center w-full px-4 py-2 text-left rounded-lg transition ${
                    currentView === "tests"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Tests
                </button>
                <button
                  onClick={() => setCurrentView("settings")}
                  className={`flex items-center w-full px-4 py-2 text-left rounded-lg transition ${
                    currentView === "settings"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Test Management Section */}
            {!showAddTest && !showAddQuestions && renderTestList()}
            {showAddTest && renderAddTestForm()}
            {showAddQuestions && selectedTest && renderQuestionsForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 