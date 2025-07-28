import React, { useRef, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OTP({ formData, showVerification, host }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const otpRefs = useRef([]);

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleOtpVerification();
    }
  };
  const handleResendOtp = async () => {
    const email = formData.email;
    setLoading(true);
    try {
      const response = await fetch(`${host}auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      console.log("Response:", response);
      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        setOtp(["", "", "", "", "", ""]);
      }
      if (!response.ok) {
        setLoading(false);
        setErrors({ otp: data.message });
      }
    } catch (error) {
      setErrors({ otp: "Failed to verify OTP. Please try again." });
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    const otpValue = otp.join("").toString();
    const email = formData.email;
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${host}auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      console.log("Response:", response);
      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
      if (!response.ok) {
        setLoading(false);
        setErrors({ otp: data.message });
      }
    } catch (error) {
      setErrors({ otp: "Failed to verify OTP. Please try again." });
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <>
      <div className="grid items-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 mt-10 ">
          <div className="text-center mb-8">
            <button
              onClick={() => showVerification(false)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 mx-auto cursor-pointer"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Signup
            </button>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Account
            </h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
              <br />
              <strong className="text-gray-800">{formData.email}</strong>
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-purple-600 hover:text-purple-500 font-medium disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Sending..." : "Resend Code"}
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleOtpVerification}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform  disabled:transform-none font-medium text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
