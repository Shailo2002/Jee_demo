import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Test {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  subject: string;
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
        id: Date.now().toString(), // Temporary ID generation
        questions: JSON.parse(bulkQuestionsInput || '[]'),
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

  const handleDeleteTest = async (testId: string) => {
    try {
      // TODO: Delete test from backend
      // await fetch(`/api/admin/tests/${testId}`, { method: 'DELETE' });
      setTests(tests.filter(test => test.id !== testId));
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Tests</h2>
      <div className="space-y-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{test.title}</h3>
              <p className="text-sm text-gray-600">
                Duration: {test.duration} mins | Questions: {test.totalQuestions}
              </p>
              <p className="text-sm text-gray-600">Subjects: {test.subject}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditQuestions(test)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Edit Questions
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowAddTest(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add New Test
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Conditional rendering */}
        {!showAddTest && !showAddQuestions && renderTestList()}
        {showAddTest && renderAddTestForm()}
        {showAddQuestions && selectedTest && renderQuestionsForm()}
      </div>
    </div>
  );
};

export default AdminDashboard; 