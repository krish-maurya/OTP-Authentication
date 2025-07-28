import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import SignUP from "./SignUP";

export default function LoginPage() {
  const host = "http://localhost:3000/";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDashboard = async () => {
    try {
      const response = await fetch(`${host}auth/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/dashboard");
      }
      if (!response.ok) {
        setErrors({ general: data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${host}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setLoading(false);
        handleDashboard();
      }
      if (!response.ok) {
        setErrors({ general: data.message });
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleForgetPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter email" });
      return;
    }

    try {
      setErrors({});
      const response = await fetch(`${host}auth/send-reset-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Email is sent");
      } else {
        setErrors({ general: data.message || "Failed to send reset email" });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ general: "Something went wrong. Try again later." });
    }
  };

  return (
    <>
      {isLogin ? (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid items-center">
            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
                <div className="hidden lg:block text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Sign In
                  </h2>
                  <p className="text-gray-600">
                    Enter your credentials to access your account
                  </p>
                </div>

                {/* Login Form */}
                <div className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleLogin();
                          }
                        }}
                        className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                      onClick={handleForgetPassword}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* General Error */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-700 text-sm">{errors.general}</p>
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform  disabled:transform-none font-medium text-lg flex items-center justify-center group"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                          size={20}
                        />
                      </>
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <button
                        className="text-blue-600 hover:text-blue-500 font-medium underline cursor-pointer"
                        onClick={() => setIsLogin(false)}
                      >
                        Create one now
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SignUP setIsLogin={setIsLogin} />
      )}
    </>
  );
}
