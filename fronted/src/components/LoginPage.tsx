"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Backend_URL } from "../contant";

interface LoginProps {
  onLogin: (user: User) => void;
  isSignUp?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
}

const LoginPage: React.FC<LoginProps> = ({
  onLogin,
  isSignUp: initialIsSignUp = false,
}) => {
  const navigate = useNavigate();
  const userdata = JSON.parse(localStorage.getItem("userdata") || "{}");
  if (userdata?.id?.length > 0) {
    onLogin(userdata);
    navigate("/");
  }
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (isSignUp && !formData.fullName) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isSignUp) {
        // Handle sign up
        try {
          const newUser = await axios.post(`${Backend_URL}/api/auth/register`, {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          });
          onLogin(newUser.data.user);
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            alert("Email already exists. Please use a different email.");
          } else {
            alert("Signup failed. Please try again later.");
          }
          console.error("Signup error:", error);
        }
      } else {
        // Handle sign in
        try {
          const newUser = await axios.post(`${Backend_URL}/api/auth/login`, {
            email: formData.email,
            password: formData.password,
          });
          console.log("check in handleSubmit");
          onLogin(newUser.data.user);
          localStorage.setItem("token", JSON.stringify(newUser.data.token));
          localStorage.setItem("userdata", JSON.stringify(newUser.data.user));
        } catch (error: unknown) {
          console.error("Login error response:", error?.response); // Debugging line
          if (error && typeof error === "object" && "response" in error) {
            const errorResponse = error.response as { status: number };
            switch (errorResponse.status) {
              case 404:
                alert("User not found. Please check your email.");
                break;
              case 401:
                alert("Incorrect password. Please try again.");
                break;
              default:
                alert("Login failed. Please try again later.");
            }
          } else {
            alert(
              "An unexpected error occurred. Please check your network and try again."
            );
          }
          console.error("Authentication error:", error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    navigate(isSignUp ? "/login" : "/signup", { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding & Welcome */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 relative">
        {/* Logo/Brand Name */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-white text-2xl font-bold hover:text-indigo-200 transition"
        >
          JeeNius
        </button>

        {/* Welcome Content */}
        <div className="flex flex-col justify-center max-w-lg mx-auto text-white">
          <h1 className="text-4xl font-bold mb-6">Glad to see you!</h1>
          <p className="text-lg text-indigo-200 leading-relaxed">
            Join our community of ambitious students preparing for JEE. Get
            access to high-quality mock tests and personalized analytics.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10"></div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden text-center mb-8">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition"
            >
              JeeNius
            </button>
          </div>

          <img
            className="mx-auto h-12 w-auto"
            src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Indian_Institute_of_Technology_Roorkee_Logo.svg/1920px-Indian_Institute_of_Technology_Roorkee_Logo.svg.png"
            alt="IIT Roorkee"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSignUp ? "Sign up" : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
