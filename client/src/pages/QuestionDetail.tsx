import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/QuestionDetail.css';

interface Question {
  id: number;
  title: string;
  body: string;
  answer: string;
  type: string;
  difficulty: string;
  bank_title: string;
  field_of_study: string;
  created_at: string;
  attachments?: any;
}

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`/api/public/questions/${id}`);
      setQuestion(response.data.question);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="question-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="question-detail-container">
        <div className="error-message">
          <h2>Question not found</h2>
          <p>The question you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444'
    };
    return colors[difficulty] || '#94a3b8';
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      mcq: 'Multiple Choice',
      short: 'Short Answer',
      long: 'Long Answer',
      truefalse: 'True/False'
    };
    return labels[type] || type;
  };

  return (
    <div className="question-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/browse')}
        >
          ← Back to Results
        </button>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        <div className="detail-main">
          {/* Meta Information */}
          <div className="meta-section">
            <div className="meta-tags">
              <span className="tag field-tag">{question.field_of_study}</span>
              <span 
                className="tag difficulty-tag"
                style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
              >
                {question.difficulty}
              </span>
              <span className="tag type-tag">{getTypeLabel(question.type)}</span>
            </div>
            <div className="meta-info">
              <span>From: <strong>{question.bank_title}</strong></span>
              <span>•</span>
              <span>{new Date(question.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Question Title */}
          <h1 className="question-title">{question.title}</h1>

          {/* Question Body */}
          <div className="question-section">
            <div className="section-label">Question</div>
            <div 
              className="question-body"
              dangerouslySetInnerHTML={{ __html: question.body }}
            />
          </div>

          {/* Answer Section */}
          <div className="answer-section">
            <div className="answer-header">
              <div className="section-label">Answer</div>
              <button 
                className="toggle-answer-btn"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? '▼ Hide Answer' : '▶ Show Answer'}
              </button>
            </div>
            
            {showAnswer && (
              <div 
                className="answer-body"
                dangerouslySetInnerHTML={{ __html: question.answer || 'No answer provided' }}
              />
            )}
          </div>

          {/* Attachments */}
          {question.attachments && Array.isArray(question.attachments) && question.attachments.length > 0 && (
            <div className="attachments-section">
              <div className="section-label">📎 Attachments</div>
              <div className="attachments-list">
                {question.attachments.map((attachment: any, index: number) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    <span>📄</span>
                    <span>{attachment.name || `Attachment ${index + 1}`}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h3>📚 About This Question</h3>
            <div className="sidebar-content">
              <div className="info-row">
                <span className="label">Field of Study:</span>
                <span className="value">{question.field_of_study}</span>
              </div>
              <div className="info-row">
                <span className="label">Question Bank:</span>
                <span className="value">{question.bank_title}</span>
              </div>
              <div className="info-row">
                <span className="label">Difficulty:</span>
                <span 
                  className="value"
                  style={{ color: getDifficultyColor(question.difficulty) }}
                >
                  {question.difficulty}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Type:</span>
                <span className="value">{getTypeLabel(question.type)}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>💡 Tip</h3>
            <p className="sidebar-text">
              Take your time reading the question carefully before viewing the answer. 
              Try to solve it yourself first!
            </p>
          </div>

          <div className="sidebar-card auth-prompt">
            <h3>🚀 Want to Upload?</h3>
            <p className="sidebar-text">
              Help other students by uploading past questions from your institution.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </div>
        </aside>
      </div>

      {/* Related Questions Section */}
      <section className="related-section">
        <h2>📖 Explore More</h2>
        <p>Continue browsing more questions or return to the browse page</p>
        <div className="related-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/browse?field=${encodeURIComponent(question.field_of_study)}`)}
          >
            Browse {question.field_of_study}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/browse')}
          >
            Browse All Questions
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuestionDetail;
