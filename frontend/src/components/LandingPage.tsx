import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            JeeNius
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition-all 
                         hover:bg-indigo-50 rounded-lg"
            >
              User Login
            </button>
            <button
              onClick={() => navigate("/adminlogin")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                         rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              Master Your <span className="text-indigo-600">JEE</span> Journey
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Elevate your preparation with our comprehensive mock tests
              designed by JEE experts. Get detailed analytics, personalized
              feedback, and boost your confidence.
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                           rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 
                           text-lg font-semibold animate-pulse"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg 
                           hover:bg-indigo-50 transition-all duration-300 text-lg font-semibold"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                className={`transform hover:scale-105 ${
                  index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">© 2024 JeeNius. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              {["About", "Contact", "Privacy", "Terms"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({
  title,
  description,
  icon,
  className = "",
}: {
  title: string;
  description: string;
  icon: string;
  className?: string;
}) => (
  <div
    className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg 
                   transition-all duration-300 ${className}`}
  >
    <div
      className="text-4xl mb-4 bg-indigo-50 w-16 h-16 rounded-lg flex items-center 
                    justify-center text-indigo-600"
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Data
const features = [
  {
    title: "Smart Mock Tests",
    description: "JEE pattern tests with adaptive difficulty",
    icon: "📝",
  },
  {
    title: "Instant Analysis",
    description: "Get detailed performance insights instantly",
    icon: "📊",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your improvement with analytics",
    icon: "📈",
  },
  {
    title: "Expert Support",
    description: "24/7 guidance from JEE experts",
    icon: "👨‍🏫",
  },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "500+", label: "Mock Tests" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "Expert Support" },
];

export default LandingPage;
