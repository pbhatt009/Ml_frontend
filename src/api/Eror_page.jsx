import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorData, setErrorData] = useState({ status: "", message: "" });

  useEffect(() => {
    const incoming = location?.state?.error;
    if (incoming) {
      setErrorData({
        status: incoming.status || "",
        message: incoming.message || "",
      });
    }
  }, [location]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-red-200">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-extrabold text-red-500">⚠️</h1>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">Oops! Something went wrong</h2>
        </div>

        {errorData.status && (
          <p className="text-xl font-semibold text-red-600">
            Status: {errorData.status}
          </p>
        )}

        {errorData.message && (
          <p className="text-gray-600 mt-2">{errorData.message}</p>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            ⬅ Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
