import { useState,useEffect, useCallback } from "react";
import { Loader2,X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ComplaintClassifierDashboard() {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("complaintHistory");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedModel, setSelectedModel] = useState("6-class");
  
const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [classes, setClasses] = useState([
    "Class A",
    "Class B",
    "Class C",
    "Class D",
    "Class E",
    "Class F",
  ]);


  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);

    if (model === "6-class") {
      setClasses([
        "Class A",
        "Class B",
        "Class C",
        "Class D",
        "Class E",
        "Class F",
      ]);
    } else {
      setClasses(["Class X", "Class Y", "Class Z"]);
    }
  };

  const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EF4444"];


  
  useEffect(() => {
    localStorage.setItem("complaintHistory", JSON.stringify(history));
  }, [history]);

  const handleClassify = async () => {
    setLoading(true);
    setResult(null);

  
    try {
      // TODO: Replace with your actual API call
      // const res = await fetch("/api/classify", { ... });
      // const data = await res.json();
      // setResult(data);

      // Mock response for now
      setTimeout(() => {
        const mockData = {
          category: "Credit Card Issues",
          confidence: "92%",
        };
        setResult(mockData);
        setHistory((prev) => [
          ...prev,
          { text: complaint, ...mockData, timestamp: new Date().toLocaleTimeString(),model:selectedModel },
        ]);
       
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong!" });
      setLoading(false);
    }
  };

  // Compute category distribution for chart
  const categoryCounts = history.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        🏦 Banking Complaint Classifier
      </h1>
         {/* Model Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Model
        </label>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="6-class">6-Class Model</option>
          <option value="3-class">3-Class Model</option>
        </select>
      </div>

      {/* Current Class Labels */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mt-3 mb-2 uppercase tracking-wide">
          Current Model Classes
        </h4>
        <div className="flex flex-wrap gap-2">
          {classes.map((cls, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
            >
              {cls}
            </span>
          ))}
        </div>
      </div>
      {/* Input Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mt-6 mb-6">
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Paste or type a customer complaint here..."
          className="w-full h-32 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleClassify}
            disabled={!complaint || loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Classifying...
              </>
            ) : (
              "Classify Complaint"
            )}
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          {result.error ? (
            <p className="text-red-600 font-semibold">{result.error}</p>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Predicted Category:
              </h2>
              <p className="text-lg text-blue-600 font-bold">
                {result.category}
              </p>
              <p className="text-gray-500 mt-1">
                Confidence: {result.confidence}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Complaint History */}
      {history.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📜 Complaint History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Time</th>
                  <th className="p-2">Complaint</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Used Model</th>
                  <th className="p-2">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx} className="border-b text-sm">
                    <td className="p-2 text-gray-500">{item.timestamp}</td>
                    <td onClick={()=>{setSelectedComplaint(item.text)}} className="p-2 truncate max-w-xs">{item.text}</td>
                    <td className="p-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-2">{item.model}</td>
                    <td className="p-2">{item.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

{selectedComplaint && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
      <button
        onClick={() => setSelectedComplaint(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X className="h-5 w-5" />
      </button>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Full Complaint</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint}</p>
    </div>
  </div>
)}

      {/* Category Distribution Chart */}
      {chartData.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📊 Complaint Category Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
