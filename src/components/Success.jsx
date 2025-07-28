import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import UnauthorizedPage from "./UnauthorizedPage";

export default function Success() {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const host = "http://localhost:3000/";

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if token exists
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${host}auth/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setShowDashboard(true);
        } else {
          console.log("Dashboard error:", data.message);
          // Don't navigate immediately, let unauthorized page show
          setShowDashboard(false);
        }
      } catch (error) {
        console.log("Dashboard error:", error);
        setShowDashboard(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]); // Added navigate to dependency array

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
      {" "}
      {showDashboard ? (
        <div>
          <div className="w-full max-w-md mx-auto text-center bg-white rounded-2xl shadow-2xl p-8 mt-10  grid items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome Aboard!
            </h2>
            <p className="text-gray-600 mb-2">
              Congratulations! Your account has been successfully created and
              verified.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              You can now access all features and start exploring our platform.
            </p>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform font-medium text-lg">
                Continue to Dashboard
              </button>
            </div>
            <div className="space-y-4 my-4">
              <button
                className="w-full bg-gradient-to-r from-red-600 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-700 transition-all duration-200 transform font-medium text-lg"
                onClick={handleLogout}
              >
                LogOut
              </button>
            </div>
          </div>
        </div>
      ) : (
        <UnauthorizedPage />
      )}
    </div>
  );
}
