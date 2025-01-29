import React from 'react';
import { Globe } from 'lucide-react';

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, userName, onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Quiz Portal</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>

            {userName && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {userName}</span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;