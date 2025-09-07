import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';

import HeartDiseasePredictor from './pages/HeartDiseasePredictor.jsx';
import ComplaintClassifierDashboard from './pages/Banking_complaint.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banking" element={<ComplaintClassifierDashboard />} />
        <Route path="/heart" element={<HeartDiseasePredictor />} />
      </Routes>
    </Router>
  );
}

export default App;
