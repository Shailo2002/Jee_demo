import React, { useState } from 'react';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Circle, 
  ChevronRight,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  BookMarked,
  Timer,
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MyTests from './MyTests';
import Analytics from './Analytics';

interface Test {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  subject: string;
}

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

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

interface DashboardProps {
  lastTestResult: TestResult | null;
  onStartTest: (testId: string) => void;
  onViewTestDetails: (result: TestResult) => void;
  testHistory: TestResult[];
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  lastTestResult, 
  onStartTest, 
  onViewTestDetails,
  testHistory,
  onLogout
}) => {
  const availableTests: Test[] = [
    {
      id: 'test1',
      title: 'JEE Mock Test 1',
      duration: 180,
      totalQuestions: 75,
      subject: 'Physics, Chemistry, Mathematics'
    },
    {
      id: 'test2',
      title: 'JEE Mock Test 2',
      duration: 180,
      totalQuestions: 75,
      subject: 'Physics, Chemistry, Mathematics'
    }
  ];

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Test Available',
      message: 'JEE Advanced Mock Test is now available',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      title: 'Test Result',
      message: 'Your JEE Main Mock Test results are ready',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Test[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'tests' | 'analytics'>('dashboard');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter available tests based on search query
    const results = availableTests.filter(test => 
      test.title.toLowerCase().includes(query.toLowerCase()) ||
      test.subject.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const getPerformanceStatus = (score: number) => {
    if (score >= 250) return { color: 'text-green-500', text: 'Excellent' };
    if (score >= 200) return { color: 'text-blue-500', text: 'Good' };
    if (score >= 150) return { color: 'text-yellow-500', text: 'Average' };
    return { color: 'text-red-500', text: 'Needs Improvement' };
  };

  // This function will render the main content based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case 'tests':
        return <MyTests onStartTest={onStartTest} />;
      case 'analytics':
        return <Analytics testHistory={testHistory} />;
      default:
        return (
          <>
            {/* Stats Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Overall Rank</p>
                        <p className="text-white text-2xl font-bold mt-1">#42</p>
                      </div>
                      <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Tests Taken</p>
                        <p className="text-white text-2xl font-bold mt-1">{testHistory.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-100" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Avg. Score</p>
                        <p className="text-white text-2xl font-bold mt-1">76%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Time Spent</p>
                        <p className="text-white text-2xl font-bold mt-1">12h</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {availableTests.map((test) => (
                        <button
                          key={test.id}
                          onClick={() => onStartTest(test.id)}
                          className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                        >
                          <BookMarked className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600">
                            {test.title}
                          </span>
                        </button>
                      ))}
                      <button className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all group">
                        <Target className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-700 text-center group-hover:text-purple-600">
                          Practice Tests
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Performance Overview */}
                  {lastTestResult && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Latest Performance</h2>
                        <span className={`text-sm font-medium ${getPerformanceStatus(lastTestResult.score).color}`}>
                          {getPerformanceStatus(lastTestResult.score).text}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-600">Correct</span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-green-600">{lastTestResult.correct}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-gray-600">Incorrect</span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-red-600">{lastTestResult.incorrect}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Timer className="w-5 h-5 text-blue-500" />
                            <span className="text-sm text-gray-600">Time Spent</span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-blue-600">42m</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                            <span className="text-sm text-gray-600">Accuracy</span>
                          </div>
                          <p className="mt-2 text-2xl font-bold text-purple-600">
                            {Math.round((lastTestResult.correct / lastTestResult.attempted) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test History */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-800">Recent Tests</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {testHistory.length === 0 ? (
                        <div className="p-8 text-center">
                          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No test history available</p>
                          <p className="text-sm text-gray-400 mt-1">Take your first test to start tracking progress</p>
                        </div>
                      ) : (
                        testHistory.map((result, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-800">{result.testTitle}</h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(result.testDate).toLocaleDateString('en-US', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-800">{result.score}/300</div>
                                  <div className={`text-xs ${getPerformanceStatus(result.score).color}`}>
                                    {getPerformanceStatus(result.score).text}
                                  </div>
                                </div>
                                <button
                                  onClick={() => onViewTestDetails(result)}
                                  className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Progress Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Physics</span>
                          <span className="text-blue-600 font-medium">75%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Chemistry</span>
                          <span className="text-blue-600 font-medium">60%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Mathematics</span>
                          <span className="text-blue-600 font-medium">85%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Tests */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tests</h2>
                    <div className="space-y-4">
                      {availableTests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all">
                          <div>
                            <h3 className="text-sm font-medium text-gray-800">{test.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{test.subject}</p>
                          </div>
                          <button
                            onClick={() => onStartTest(test.id)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          >
                            Start
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* New Header Design */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Indian_Institute_of_Technology_Roorkee_Logo.svg/1920px-Indian_Institute_of_Technology_Roorkee_Logo.svg.png" 
                  alt="IIT Roorkee" 
                  className="h-10 w-10 object-contain mr-3"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900">IIT Roorkee</span>
                  <span className="text-xs text-gray-500">Online Test Portal</span>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:block ml-8 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Search Results Dropdown */}
                {searchQuery && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No tests found
                      </div>
                    ) : (
                      searchResults.map((test) => (
                        <button
                          key={test.id}
                          onClick={() => {
                            onStartTest(test.id);
                            setSearchQuery('');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          <p className="text-sm font-medium text-gray-800">{test.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{test.subject}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`text-sm font-medium ${
                    currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  } transition-colors`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setCurrentView('tests')}
                  className={`text-sm font-medium ${
                    currentView === 'tests' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  } transition-colors`}
                >
                  My Tests
                </button>
                <button 
                  onClick={() => setCurrentView('analytics')}
                  className={`text-sm font-medium ${
                    currentView === 'analytics' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  } transition-colors`}
                >
                  Analytics
                </button>
              </nav>

              {/* Action Icons */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <Bell className="mx-auto h-6 w-6 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                  <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(notification.time, { addSuffix: true })}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="px-4 py-2 border-t border-gray-100">
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <Settings className="h-5 w-5" />
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-700">John Doe</div>
                        <div className="text-xs text-gray-500">Student</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        Your Profile
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </a>
                      <hr className="my-1 border-gray-100" />
                      <button 
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderMainContent()}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-lg font-semibold text-gray-800">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 px-4 py-6 space-y-6">
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setCurrentView('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-base font-medium ${
                      currentView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                    } rounded-lg hover:bg-gray-50`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentView('tests');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-base font-medium ${
                      currentView === 'tests' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                    } rounded-lg hover:bg-gray-50`}
                  >
                    My Tests
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentView('analytics');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-base font-medium ${
                      currentView === 'analytics' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                    } rounded-lg hover:bg-gray-50`}
                  >
                    Analytics
                  </button>
                </div>
                
                <hr className="border-gray-100" />
                
                <div className="space-y-3">
                  <div className="px-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Account</p>
                  </div>
                  <a href="#" className="block px-3 py-2 text-base font-medium text-gray-500 rounded-lg hover:bg-gray-50">
                    Your Profile
                  </a>
                  <a href="#" className="block px-3 py-2 text-base font-medium text-gray-500 rounded-lg hover:bg-gray-50">
                    Settings
                  </a>
                  <button 
                    onClick={onLogout}
                    className="block w-full px-3 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 text-left"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 