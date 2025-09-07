import { Link } from 'react-router-dom';
import { Brain, Heart, ExternalLink, GitBranch,Banknote } from 'lucide-react';

const Home = () => {
  const projects = [

    {
      id: 1,
      title: 'Heart Disease Predictor',
      description: 'Predictive model that assesses the risk of heart disease based on various health parameters and lifestyle factors.',
      icon: <Heart className="h-8 w-8 text-red-600" />,
      link: '/heart',
      notebookLink: 'https://github.com/yourusername/heart-disease-predictor/blob/main/heart_disease_predictor.ipynb',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      features: ['Chest Pain Analysis', 'Blood Pressure & Cholesterol', 'Risk Assessment']
    },
    {
      id: 2,
      title: 'Banking Complaint Classifier',
      description: 'Machine learning model that classifies banking-related complaints into predefined categories to assist in faster resolution and customer support automation.',
      icon: '🏦', // you can also use Landmark or FileText icon
      link: '/banking',
      notebookLink: 'https://github.com/yourusername/banking-complaint-classifier/blob/main/banking_complaint_classifier.ipynb',
    
       color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      features: ['Complaint Categorization', 'NLP-based Text Processing', 'Automated Customer Support']
    },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ML Project Hub</h1>
                <p className="text-gray-600">Machine Learning Model</p>
              </div>
            </div>
            {/* <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <GitBranch className="h-4 w-4" />
              <span>v1.0.0</span>
            </div> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Explore My
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ML Models</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Interactive machine learning models ready for testing. Each project includes detailed notebooks 
            and live prediction capabilities with modern, user-friendly interfaces.
          </p>
        </div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`card p-8 hover:scale-105 transform transition-all duration-300 animate-slide-up ${project.bgColor}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <div className='h-8 w-8 '>{project.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/60 text-gray-700 text-sm rounded-full border border-gray-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={project.link}
                  className={`btn-primary flex-1 text-center bg-gradient-to-r ${project.color} hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
                >
                  Try Model
                </Link>
                <a
                  href={project.notebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 text-center flex items-center justify-center space-x-2 hover:shadow-md"
                >
                  <span>View Notebook</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2</div>
              <div className="text-gray-600">Active Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Average Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">Real-time</div>
              <div className="text-gray-600">Predictions</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ML Project Hub. Built with React & Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
