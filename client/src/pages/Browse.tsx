import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Browse.css';

interface Question {
  id: number;
  title: string;
  body: string;
  type: string;
  difficulty: string;
  bank_title: string;
  field_of_study: string;
  created_at: string;
}

const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedField, setSelectedField] = useState(searchParams.get('field') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
  const [fields, setFields] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFields();
    fetchQuestions();
  }, [searchParams]);

  const fetchFields = async () => {
    try {
      const response = await axios.get('/api/public/fields');
      setFields(response.data.fields.map((f: any) => f.field_of_study));
    } catch (error) {
      console.error('Failed to fetch fields:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        field: selectedField,
        type: selectedType,
        difficulty: selectedDifficulty,
        limit: '20',
        offset: String((page - 1) * 20),
      });

      const response = await axios.get(`/api/public/questions/search?${params}`);
      setQuestions(response.data.items);
      setHasMore(response.data.items.length === 20);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedField) params.append('field', selectedField);
    if (selectedType) params.append('type', selectedType);
    if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
    setSearchParams(params);
  };

  const handleViewQuestion = (id: number) => {
    navigate(`/question/${id}`);
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      mcq: '○',
      short: '▯',
      long: '▭',
      truefalse: '◐'
    };
    return icons[type] || '●';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444'
    };
    return colors[difficulty] || '#94a3b8';
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Questions</h1>
        <p>Search through thousands of past examination questions</p>
      </div>

      <div className="browse-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button 
              className="reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedField('');
                setSelectedType('');
                setSelectedDifficulty('');
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>

          <form className="filters-form" onSubmit={handleSearch}>
            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Field of Study */}
            <div className="filter-group">
              <label>Field of Study</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="filter-select"
              >
                <option value="">All Fields</option>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div className="filter-group">
              <label>Question Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="mcq">Multiple Choice</option>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="truefalse">True/False</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="filter-group">
              <label>Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="filter-select"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button type="submit" className="apply-filters-btn">
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Questions List */}
        <main className="questions-list">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No questions found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>Found <strong>{questions.length}</strong> questions</p>
              </div>

              <div className="questions-grid">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="question-card"
                    onClick={() => handleViewQuestion(question.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="question-meta">
                      <div className="question-type" title={`Type: ${question.type}`}>
                        {getTypeIcon(question.type)}
                      </div>
                      <div 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
                      >
                        {question.difficulty}
                      </div>
                    </div>

                    <h3 className="question-title">{question.title}</h3>

                    <p className="question-preview">
                      {question.body.substring(0, 100)}...
                    </p>

                    <div className="question-footer">
                      <span className="bank-name">{question.bank_title}</span>
                      <span className="field-badge">{question.field_of_study}</span>
                    </div>

                    <div className="question-action">
                      <span>View Question →</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {hasMore && (
                <div className="pagination">
                  <button
                    className="btn-secondary"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {page}</span>
                  <button
                    className="btn-primary"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Signup CTA (if not logged in) */}
      <section className="cta-section">
        <h2>Want to share past questions?</h2>
        <p>Register now and start uploading questions from your institution</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/register')}
        >
          Register to Upload
        </button>
      </section>
    </div>
  );
};

export default Browse;
