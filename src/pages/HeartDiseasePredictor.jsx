import { useState } from 'react';
import { Heart, ArrowLeft, ExternalLink, Info, Loader2, CheckCircle, XCircle, Code } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { heart_disease_risk } from '../utility/index.js';

const HeartDiseasePredictor = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    age: 50,
    sex: 1,
    chestPainType: 3,
    restingBP: 150,
    cholesterol: 200,
    fastingBS: 0,
    restECG: 1,
    maxHR: 180,
    exerciseAngina: 0,
    oldpeak: 0.5,
    slope: 2,
    ca: 0,
    thal: 2
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'oldpeak' ? parseFloat(value) : parseInt(value, 10);
    setInput({ ...input, [name]: isNaN(parsedValue) ? (name === 'oldpeak' ? 0 : 0) : parsedValue });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Map UI state to API schema without changing UI field names
    const payload = {
      age: input.age,
      sex: input.sex,
      cp: input.chestPainType - 1,
      trestbps: input.restingBP,
      chol: input.cholesterol,
      fbs: input.fastingBS,
      restecg: input.restECG,
      thalach: input.maxHR,
      exang: input.exerciseAngina,
      oldpeak: input.oldpeak,
      slope: input.slope - 1,
      ca: input.ca,
      thal: input.thal - 1,
    };

    
    
    const res=await heart_disease_risk(payload);
    //error handling of unexpected error
    if(res.error_data){
      navigate('/error', { state: { error: res.error_data } });
      return;
    }

    //error handling of expected error
    if(res.detail.errors){
      setError(res.detail.errors.message);
      setResult(null);
      setLoading(false);
      return;
    }
    
   
  const data = res.detail.data;
  const probs = data.prediction[0] || [0, 0];
  const riskProb = Number(probs[1]) || 0; // probability of class 1 (disease)
  let level = 'low';
  if (riskProb > 0.75) level = 'high';
  else if (riskProb > 0.5) level = 'moderate';

  const result = {
    prediction: level === 'high' ? 'High Risk' : level === 'moderate' ? 'Moderate Risk' : 'Low Risk',
    confidence: (riskProb * 100).toFixed(2),
    level,
  };

  setResult(result);
  setLoading(false);
};

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-red-500 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Heart Disease Predictor</h1>
                  <p className="text-gray-600 text-sm">AI-powered risk assessment</p>
                </div>
              </div>
            </div>
            <a
              href="https://github.com/yourusername/heart-disease-predictor/blob/main/heart_disease_predictor.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary hidden sm:flex items-center space-x-2"
            >
              <span>View Notebook</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Input Parameters</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="text-xs text-gray-500">0 - 120</p>
                <input
                  type="number"
                  name="age"
                  min={0}
                  max={120}
                  value={input.age}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <p className="text-xs text-gray-500">0 = Female, 1 = Male</p>
                <select
                  name="sex"
                  value={input.sex}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
                <p className="text-xs text-gray-500">0-3 (0 Typical, 1 Atypical, 2 Non-anginal, 3 Asymptomatic)</p>
                <select
                  name="chestPainType"
                  value={input.chestPainType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={1}>Typical Angina</option>
                  <option value={2}>Atypical Angina</option>
                  <option value={3}>Non-anginal Pain</option>
                  <option value={4}>Asymptomatic</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Resting Blood Pressure</label>
                <p className="text-xs text-gray-500">80 - 250 mmHg</p>
                <input
                  type="number"
                  name="restingBP"
                  min={80}
                  max={250}
                  value={input.restingBP}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cholesterol</label>
                <p className="text-xs text-gray-500">100 - 600 mg/dl</p>
                <input
                  type="number"
                  name="cholesterol"
                  min={100}
                  max={600}
                  value={input.cholesterol}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar</label>
                <p className="text-xs text-gray-500">0 = False (&lt;=120), 1 = True (&gt;120)</p>
                <select
                  name="fastingBS"
                  value={input.fastingBS}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={1}>&gt; 120 mg/dl</option>
                  <option value={0}>&lt;= 120 mg/dl</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Resting ECG</label>
                <p className="text-xs text-gray-500">0-2</p>
                <select
                  name="restECG"
                  value={input.restECG}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={0}>Normal</option>
                  <option value={1}>ST-T Wave Abnormality</option>
                  <option value={2}>Left Ventricular Hypertrophy</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Max Heart Rate</label>
                <p className="text-xs text-gray-500">50 - 250 bpm</p>
                <input
                  type="number"
                  name="maxHR"
                  min={50}
                  max={250}
                  value={input.maxHR}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Exercise Angina</label>
                <p className="text-xs text-gray-500">0 = No, 1 = Yes</p>
                <select
                  name="exerciseAngina"
                  value={input.exerciseAngina}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Oldpeak</label>
                <p className="text-xs text-gray-500">0.0 - 10.0</p>
                <input
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  min={0}
                  max={10}
                  value={input.oldpeak}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Slope of ST</label>
                <p className="text-xs text-gray-500">0-2</p>
                <select
                  name="slope"
                  value={input.slope}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={1}>Upsloping</option>
                  <option value={2}>Flat</option>
                  <option value={3}>Downsloping</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of Major Vessels</label>
                <p className="text-xs text-gray-500">0 - 4</p>
                <select
                  name="ca"
                  value={input.ca}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Thalassemia</label>
                <p className="text-xs text-gray-500">0-3 (0 normal, 1 fixed defect, 2 reversible defect, 3 unknown)</p>
                <select
                  name="thal"
                  value={input.thal}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value={1}>Normal</option>
                  <option value={2}>Fixed Defect</option>
                  <option value={3}>Reversible Defect</option>
                  <option value={4}>Unknown</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Calculating...' : 'Assess Risk'}
              </button>
            </form>
            {error && (
              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <h3 className="font-semibold text-red-600">Error</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div
                className={
                  `mt-6 p-4 rounded-lg ` +
                  (result.level === 'high'
                    ? 'bg-red-100'
                    : result.level === 'moderate'
                    ? 'bg-orange-100'
                    : 'bg-green-100')
                }
              >
                <h3
                  className={
                    `font-semibold ` +
                    (result.level === 'high'
                      ? 'text-red-600'
                      : result.level === 'moderate'
                      ? 'text-orange-600'
                      : 'text-green-600')
                  }
                >
                  Risk Assessment Result:
                </h3>
                <p>
                  Risk: {result.prediction}
                </p>
                <p>
                  Probability (Heart Disease Presence): {result.confidence}%
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeartDiseasePredictor;

