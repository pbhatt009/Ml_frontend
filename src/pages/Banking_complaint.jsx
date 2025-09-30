import { useState,useEffect, useCallback } from "react";
import { Loader2,X, Trash2, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { banking_complaint } from "../utility/index.js"

export default function ComplaintClassifierDashboard() {
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [history6Class, setHistory6Class] = useState(() => {
    const stored = localStorage.getItem("complaintHistory6Class");
    return stored ? JSON.parse(stored) : [];
  });
  const [history3Class, setHistory3Class] = useState(() => {
    const stored = localStorage.getItem("complaintHistory3Class");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedModel, setSelectedModel] = useState("6-class");
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [classes, setClasses] = useState(['Banking and Payments', 'Credit Card', 'Credit Reporting', 'Debt collection', 'Loan', 'Mortgage']);


const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);

    if (model === "6-class") {
      setClasses(
        ['Banking and Payments', 'Credit Card', 'Credit Reporting', 'Debt collection', 'Loan', 'Mortgage']
      );
    } else {
      setClasses(["Banking & Payments", "Credit & Debt", "Loans & Mortgages"]);
    }
  };

  const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EF4444"];


  
  useEffect(() => {
    localStorage.setItem("complaintHistory6Class", JSON.stringify(history6Class));
  }, [history6Class]);

  useEffect(() => {
    localStorage.setItem("complaintHistory3Class", JSON.stringify(history3Class));
  }, [history3Class]);

  const handleClassify = async () => {
    setLoading(true);
    setResult(null);
    let modelnum = 1;
    if(selectedModel === "6-class") modelnum = 2;

    try {
      const res = await banking_complaint({'complaint': complaint, 'model': modelnum});
      
      //error handling of unexpected error
      if(res.error_data){
        navigate('/error', { state: { error: res.error_data } });
        return;
      }
  
      //error handling of expected error
      if(res.detail.errors){
        setResult({ error: res.detail.errors.message });
        setLoading(false);
        return;
      }
      
      const prob = res.detail.data.prediction[0];
      const maxIndex = prob.indexOf(Math.max(...prob));
      const category = classes[maxIndex];
      const confidence = (prob[maxIndex] * 100).toFixed(1) + "%";
      
      const resultData = {
        category: category,
        confidence: confidence,
        probabilities: prob.map((p, index) => ({
          class: classes[index],
          probability: (p * 100).toFixed(1)
        }))
      };
      
      setResult(resultData);
      
      // Add to appropriate history based on model
      if (selectedModel === "6-class") {
        setHistory6Class((prev) => [
          ...prev,
          { 
            text: complaint, 
            ...resultData, 
            timestamp: new Date().toLocaleTimeString(),
            model: selectedModel 
          },
        ]);
      } else {
        setHistory3Class((prev) => [
          ...prev,
          { 
            text: complaint, 
            ...resultData, 
            timestamp: new Date().toLocaleTimeString(),
            model: selectedModel 
          },
        ]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong!" });
      setLoading(false);
    }
  };

  // Get current history based on selected model
  const currentHistory = selectedModel === "6-class" ? history6Class : history3Class;

  // Compute category distribution for chart
  const categoryCounts = currentHistory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  // Get current result probabilities for histogram
  const currentProbabilities = result?.probabilities || [];
  const probabilityChartData = currentProbabilities.map(prob => ({
    name: prob.class,
    value: parseFloat(prob.probability)
  }));

  // Function to remove item from history
  const removeFromHistory = (index) => {
    if (selectedModel === "6-class") {
      setHistory6Class(prev => prev.filter((_, i) => i !== index));
    } else {
      setHistory3Class(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Function to clear all history for current model
  const clearHistory = () => {
    if (selectedModel === "6-class") {
      setHistory6Class([]);
    } else {
      setHistory3Class([]);
    }
  };

  return (
    <div className="p-1 sm:p-6 w-[100vw]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          🏦 Banking Complaint Classifier
        </h1>
        <div className="flex flex-col m-1 gap-2 md:gap-5 ">
          <a
            href="https://github.com/yourusername/banking-complaint-classifier/blob/main/banking_complaint_classifier_6class.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition"
          >
            <ExternalLink className="h-4 w-4" />
            6-Class Notebook
          </a>
          <a
            href="https://github.com/yourusername/banking-complaint-classifier/blob/main/banking_complaint_classifier_3class.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition"
          >
            <ExternalLink className="h-4 w-4" />
            3-Class Notebook
          </a>
        </div>
      </div>

      {/* Model Selector */}
      <div className="mb-6">
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Classification Result
              </h2>
              <div className="mb-4">
                <p className="text-lg text-blue-600 font-bold">
                  {result.category}
                </p>
                <p className="text-gray-500 mt-1">
                  Confidence: {result.confidence}
                </p>
              </div>
              
              {/* Probability Details */}
              {result.probabilities && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Class Probabilities</h3>
                  <div className="space-y-2">
                    {result.probabilities.map((prob, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{prob.class}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${prob.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-12 text-right">
                            {prob.probability}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Complaint History */}
      {currentHistory.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              📜 {selectedModel === "6-class" ? "6-Class" : "3-Class"} Model History
            </h2>
            <button
              onClick={clearHistory}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg flex items-center gap-1 transition"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Time</th>
                  <th className="p-2">Complaint</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Confidence</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentHistory.map((item, idx) => (
                  <tr key={idx} className="border-b text-sm hover:bg-gray-50">
                    <td className="p-2 text-gray-500">{item.timestamp}</td>
                    <td 
                      onClick={()=>{setSelectedComplaint(item.text)}} 
                      className="p-2 truncate max-w-xs cursor-pointer hover:text-blue-600"
                    >
                      {item.text}
                    </td>
                    <td className="p-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-2">{item.confidence}</td>
                    <td className="p-2">
                      <button
                        onClick={() => removeFromHistory(idx)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Remove from history"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
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

      {/* Charts Section */}
      <div className="flex flex-col justify-center items-center">
        {/* Current Prediction Probabilities */}
        {probabilityChartData.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl p-1 sm:p-10 w-full ">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Current Prediction Probabilities
            </h2>
            <div className="h-130 w-full text-xs sm:text-md lg:text-l">
              <ResponsiveContainer>
                <BarChart data={probabilityChartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={150}
                    interval={0}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Probability']}
                    labelFormatter={(label) => `Class: ${label} `}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Distribution Chart */}
        {chartData.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl mt-10 p-1 sm:p-10 w-full">
            <h2 className="w-full text-xs sm:text-md lg:text-l font-semibold mb-4 text-gray-800">
              📈 {selectedModel === "6-class" ? "6-Class" : "3-Class"} Model History Distribution
            </h2>
            <div className="h-130">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={150}
                    interval={0}
                  />
                  <YAxis 
                    label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Count']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
