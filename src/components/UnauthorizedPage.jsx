import { Shield, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    navigate("/");
    console.log("Navigate to home page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">401</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Unauthorized Access
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            Sorry, you don't have permission to access this resource. Please
            check your credentials or contact your administrator.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700 text-sm">
              <strong>Access Denied:</strong> You need proper authorization to
              view this page.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Login Page
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Error Code: 401 | Unauthorized Access
          </p>
        </div>
      </div>
    </div>
  );
}
