import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: Implement admin authentication logic here
      // const response = await adminLogin(formData);
      // if successful, redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="mt-2 text-gray-600">
            Sign in to access admin dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-indigo-500 
                         focus:border-indigo-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-indigo-500 
                         focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white 
                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
                       hover:to-purple-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
