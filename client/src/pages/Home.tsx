import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ banks: 0, questions: 0, users: 0, fields: 0 });
  const [fields, setFields] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchFields();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/public/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await axios.get('/api/public/fields');
      setFields(response.data.fields.map((f: any) => f.field_of_study));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(searchQuery)}${selectedField ? `&field=${selectedField}` : ''}`);
  };

  const handleFieldClick = (field: string) => {
    navigate(`/browse?field=${encodeURIComponent(field)}`);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>HND Question Bank</h1>
          <p>Access thousands of past questions across all fields of study</p>
          
          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search questions, topics, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="field-select"
              >
                <option value="">All Fields</option>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <button type="submit" className="search-btn">Search</button>
            </div>
          </form>

          {/* Call to Action */}
          <div className="cta-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/browse')}
            >
              Browse All Questions
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Register to Upload
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats">
        <div className="stat-card">
          <h3>{stats.questions}</h3>
          <p>Questions</p>
        </div>
        <div className="stat-card">
          <h3>{stats.banks}</h3>
          <p>Question Banks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.fields}</h3>
          <p>Fields of Study</p>
        </div>
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Contributors</p>
        </div>
      </section>

      {/* Fields of Study Section */}
      <section className="fields-section">
        <h2>Browse by Field of Study</h2>
        <p className="section-subtitle">Explore questions organized by academic discipline</p>
        
        {loading ? (
          <div className="loading">Loading fields...</div>
        ) : (
          <div className="fields-grid">
            {fields.map((field) => (
              <div
                key={field}
                className="field-card"
                onClick={() => handleFieldClick(field)}
                role="button"
                tabIndex={0}
              >
                <div className="field-icon">📚</div>
                <h3>{field}</h3>
                <p>Click to explore</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose HND Question Bank?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find questions by topic, difficulty, or type with powerful search</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>Organized Content</h3>
            <p>Questions are organized by field of study for easy navigation</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Driven</h3>
            <p>Share and contribute past questions from your institution</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Better Learning</h3>
            <p>Practice with real past examination questions</p>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="signup-section">
        <h2>Want to Upload Past Questions?</h2>
        <p>Create an account and start contributing to the community</p>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => navigate('/register')}
        >
          Create Account
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 HND Question Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
