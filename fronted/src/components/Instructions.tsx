"use client";

import React, { useState } from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import QuetionWindow from "./QuetionWindow";

interface InstructionsProps {
  onProceed: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onProceed }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Test Instructions</h1>
          <p className="text-gray-600 mt-2">Please read all instructions carefully before proceeding</p>
        </div>

        {/* General Instructions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">General Instructions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800">Duration</h3>
                <p className="text-gray-600">The test duration is 180 minutes (3 hours)</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800">Question Pattern</h3>
                <p className="text-gray-600">The test consists of 75 questions divided into three sections:</p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>Physics (25 questions)</li>
                  <li>Chemistry (25 questions)</li>
                  <li>Mathematics (25 questions)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Marking Scheme */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Marking Scheme</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800">Correct Answer</h3>
                <p className="text-gray-600">+4 marks will be awarded for each correct answer</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800">Incorrect Answer</h3>
                <p className="text-gray-600">-1 mark will be deducted for each incorrect answer</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800">Unattempted Question</h3>
                <p className="text-gray-600">0 marks for questions not attempted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Instructions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Navigation Instructions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Question Navigation:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Click on the question number in the Question Palette to go to that question directly</li>
                <li>Use "Save & Next" to save your answer and move to the next question</li>
                <li>Use "Mark for Review & Next" to flag questions you want to review later</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Section Navigation:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Sections are displayed on the top bar - click to view questions from that section</li>
                <li>You can switch between sections at any time during the exam</li>
                <li>Use the Question Palette to track your progress across all sections</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Important Notes</h2>
          </div>
          <div className="p-6 space-y-3">
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>You can change your answer at any time during the test</li>
              <li>The timer will be displayed at the top of the screen</li>
              <li>The test will be automatically submitted when the time is up</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Use the language selector in the header to change the question language</li>
            </ul>
          </div>
        </div>

        {/* Agreement and Action */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <input
              id="agreement"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="agreement" className="text-sm text-gray-700">
              I have read and understood all the instructions
            </label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onProceed}
              disabled={!isChecked}
              className={`px-6 py-2 rounded-md transition-colors ${
                isChecked
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
