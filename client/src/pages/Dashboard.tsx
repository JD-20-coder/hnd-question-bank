import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import BankCard from '../components/BankCard';
import { Link } from 'react-router-dom';
import { AiOutlineFolder, AiOutlineQuestion, AiOutlineUser } from 'react-icons/ai';

interface DashboardStats {
  banks: number;
  questions: number;
  users: number;
}

interface Bank {
  id: number;
  title: string;
  description?: string;
  questions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export default function Dashboard() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ banks: 0, questions: 0, users: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const config = token ? {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      } : { withCredentials: true };
      
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
      const banksUrl = `${API_BASE}/banks`;
      const statsUrl = `${API_BASE}/stats`;
      
      // Make API calls
      const [banksRes, statsRes] = await Promise.all([
        axios.get(banksUrl, config),
        axios.get(statsUrl, config),
      ]);
      
      // Handle different response structures
      const banksData = banksRes.data;
      const statsData = statsRes.data;
      
      // Check if banks data is in items property or directly
      const bankList = banksData.items || banksData.banks || banksData || [];
      
      setBanks(bankList);
      setStats({
        banks: statsData.banks || statsData.totalBanks || 0,
        questions: statsData.questions || statsData.totalQuestions || 0,
        users: statsData.users || statsData.totalUsers || 0
      });
      
      setError(null);
      
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Your session has expired. Please login again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            break;
          case 403:
            setError('You do not have permission to access this dashboard.');
            break;
          case 404:
            setError('Dashboard data not found.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(`Error ${err.response.status}: ${err.response.data?.error || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else {
        setError(`Application error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => (
    <div className="card" style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="small">{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{value}</div>
        </div>
        <div className="center" style={{ width: 60, height: 60, background: `${color}15`, borderRadius: 12, fontSize: 28 }}>
          <Icon />
        </div>
      </div>
    </div>
  );

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchDashboardData();
  };

  return (
    <Layout>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#e2e8f0' }}>Dashboard</h2>
            <p style={{ margin: '8px 0 0', color: '#a0aec0', fontSize: '0.95rem' }}>Welcome back! Here's your overview</p>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="alert error" style={{ marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>⚠️ Dashboard Error</strong>
              <div style={{ fontSize: '0.9rem' }}>{error}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleRetry} className="btn btn-small">Retry</button>
              <button onClick={() => setError(null)} className="btn btn-small secondary">Dismiss</button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 40, gap: 20 }}>
          <StatCard icon={AiOutlineFolder} label="Question Banks" value={stats.banks} color="#8b5cf6" />
          <StatCard icon={AiOutlineQuestion} label="Total Questions" value={stats.questions} color="#10b981" />
          <StatCard icon={AiOutlineUser} label="Users" value={stats.users} color="#f59e0b" />
        </div>

        {/* Your Question Banks Section */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0' }}>Your Question Banks</h3>
              <p style={{ margin: '8px 0 0', color: '#a0aec0', fontSize: '0.9rem' }}>
                {banks.length > 0 ? `${banks.length} bank${banks.length !== 1 ? 's' : ''} available` : 'Get started by creating your first bank'}
              </p>
            </div>
            <Link to="/banks" style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AiOutlineFolder size={18} />
                Create New
              </button>
            </Link>
          </div>
          
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                border: '4px solid rgba(139,92,246,0.2)',
                borderTopColor: '#8b5cf6',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{ color: '#a0aec0', fontSize: '1rem' }}>Loading dashboard data...</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : banks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ 
                fontSize: 64, 
                marginBottom: 20,
                filter: 'grayscale(1)',
                opacity: 0.5
              }}>📚</div>
              <h3 style={{ marginBottom: 12, color: '#e2e8f0' }}>No question banks yet</h3>
              <p style={{ marginBottom: 32, color: '#a0aec0', maxWidth: '400px', margin: '0 auto 32px' }}>
                Create your first question bank to organize and manage your questions efficiently
              </p>
              <Link to="/banks" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ padding: '12px 24px' }}>
                  Create your first bank
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid" style={{ gap: 20 }}>
                {banks.slice(0, 6).map(bank => (
                  <BankCard key={bank.id} bank={bank} />
                ))}
              </div>
              {banks.length > 6 && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <Link to="/banks" style={{ textDecoration: 'none' }}>
                    <button className="btn secondary">
                      View All Banks ({banks.length})
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Stats Section */}
        {!loading && banks.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ marginBottom: 20, fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0' }}>Quick Insights</h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="card">
                <div style={{ fontSize: 14, color: '#a0aec0', marginBottom: 12, fontWeight: 500 }}>Average Questions Per Bank</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#e2e8f0' }}>
                  {stats.banks > 0 ? (stats.questions / stats.banks).toFixed(1) : 0}
                </div>
              </div>
              <div className="card">
                <div style={{ fontSize: 14, color: '#a0aec0', marginBottom: 12, fontWeight: 500 }}>Total System Users</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#e2e8f0' }}>{stats.users}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}