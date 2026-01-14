import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineBook, AiOutlineQuestionCircle, AiOutlineFileText, AiOutlineUser, AiOutlineArrowRight, AiOutlineCheck } from 'react-icons/ai';

export default function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const features = [
    {
      icon: AiOutlineBook,
      title: 'Question Banks',
      description: 'Organize questions into banks by subject, topic, or difficulty level'
    },
    {
      icon: AiOutlineQuestionCircle,
      title: 'Rich Question Editor',
      description: 'Create questions with rich text formatting, images, and attachments'
    },
    {
      icon: AiOutlineFileText,
      title: 'Exam Builder',
      description: 'Build custom exams by selecting questions from your banks'
    },
    {
      icon: AiOutlineUser,
      title: 'User Management',
      description: 'Manage users, roles, and permissions with ease'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)' }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.2rem'
          }}>
            HB
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' }}>HND Question Bank</div>
            <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>Manage your questions efficiently</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {token ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button className="btn secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Dashboard
                  <AiOutlineArrowRight size={16} />
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="btn ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AiOutlineUser size={18} />
                  Login
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Get Started
                  <AiOutlineArrowRight size={16} />
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #8b5cf6, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 24,
          lineHeight: 1.2
        }}>
          Manage Question Banks
          <br />
          Like Never Before
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: '#a0aec0',
          marginBottom: 40,
          lineHeight: 1.6,
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Create, organize, and manage question banks with ease. Build custom exams, 
          track statistics, and collaborate with your team.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {token ? (
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
                Go to Dashboard
                <AiOutlineArrowRight size={18} style={{ marginLeft: 8 }} />
              </button>
            </Link>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
                  Get Started Free
                  <AiOutlineArrowRight size={18} style={{ marginLeft: 8 }} />
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="btn secondary" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
                  Sign In
                </button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '60px 40px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: 16,
            color: '#e2e8f0'
          }}>
            Everything You Need
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#a0aec0',
            marginBottom: 48,
            fontSize: '1.1rem'
          }}>
            Powerful features to manage your question banks efficiently
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    textAlign: 'left',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    fontSize: 24,
                    color: '#8b5cf6'
                  }}>
                    <Icon />
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: 12,
                    color: '#e2e8f0'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#a0aec0',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(16,185,129,0.1))',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: 20,
            color: '#e2e8f0'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#a0aec0',
            marginBottom: 32,
            lineHeight: 1.6
          }}>
            Join thousands of educators managing their question banks efficiently
          </p>
          {!token && (
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Create Free Account
                <AiOutlineArrowRight size={18} style={{ marginLeft: 8 }} />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: '#718096',
        fontSize: '0.9rem'
      }}>
        <div style={{ marginBottom: 12 }}>
          <strong style={{ color: '#a0aec0' }}>HND Question Bank</strong> - Manage your questions efficiently
        </div>
        <div>
          © {new Date().getFullYear()} All rights reserved
        </div>
      </footer>
    </div>
  );
}

