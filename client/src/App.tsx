import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AiOutlineUser, AiOutlineUserAdd, AiOutlineLogout, AiOutlineHome } from 'react-icons/ai';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BankList = React.lazy(() => import('./pages/BankList'));
const BankDetail = React.lazy(() => import('./pages/BankDetail'));
const BankEdit = React.lazy(() => import('./pages/BankEdit'));
const QuestionList = React.lazy(() => import('./pages/QuestionList'));
const QuestionEditor = React.lazy(() => import('./pages/QuestionEditor'));
const ExamList = React.lazy(() => import('./pages/ExamList'));
const ExamBuilder = React.lazy(() => import('./pages/ExamBuilder'));
const Home = React.lazy(() => import('./pages/Home'));
const Browse = React.lazy(() => import('./pages/Browse'));
const QuestionDetail = React.lazy(() => import('./pages/QuestionDetail'));

const Fallback = () => (
  <div style={{
    padding: 48,
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
  }}>
    <div>
      <div style={{
        width: 40,
        height: 40,
        border: '4px solid rgba(139,92,246,0.2)',
        borderTopColor: '#8b5cf6',
        borderRadius: '50%',
        margin: '0 auto 16px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div style={{ color: '#a0aec0' }}>Loading...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

function AppHeader() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    // Listen for storage changes (logout from other tabs)
    window.addEventListener('storage', checkAuth);
    // Check periodically
    const interval = setInterval(checkAuth, 1000);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // Don't show header on landing, login, register, or auth pages
  const hideHeader = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/home', '/browse'].includes(location.pathname) || location.pathname.startsWith('/question/');

  if (hideHeader) return null;

  return (
    <header style={{
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10, 14, 39, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.1rem'
        }}>
          HB
        </div>
        <div style={{ fontWeight: 700, color: '#e2e8f0' }}>HND Question Bank</div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AiOutlineHome size={18} />
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="btn danger"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <AiOutlineLogout size={18} />
              Logout
            </button>
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
                <AiOutlineUserAdd size={18} />
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
        <AppHeader />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<React.Suspense fallback={<Fallback />}><Home /></React.Suspense>} />
          <Route path="/home" element={<React.Suspense fallback={<Fallback />}><Home /></React.Suspense>} />
          <Route path="/browse" element={<React.Suspense fallback={<Fallback />}><Browse /></React.Suspense>} />
          <Route path="/question/:id" element={<React.Suspense fallback={<Fallback />}><QuestionDetail /></React.Suspense>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><React.Suspense fallback={<Fallback />}><Dashboard /></React.Suspense></PrivateRoute>} />
          <Route path="/banks" element={<React.Suspense fallback={<Fallback />}><BankList /></React.Suspense>} />
          <Route path="/banks/:id" element={<React.Suspense fallback={<Fallback />}><BankDetail /></React.Suspense>} />
          <Route path="/banks/:id/edit" element={<PrivateRoute><React.Suspense fallback={<Fallback />}><BankEdit /></React.Suspense></PrivateRoute>} />
          <Route path="/questions" element={<React.Suspense fallback={<Fallback />}><QuestionList /></React.Suspense>} />
          <Route path="/questions/:id" element={<PrivateRoute><React.Suspense fallback={<Fallback />}><QuestionEditor /></React.Suspense></PrivateRoute>} />
          <Route path="/exams" element={<PrivateRoute><React.Suspense fallback={<Fallback />}><ExamList /></React.Suspense></PrivateRoute>} />
          <Route path="/exams/:id" element={<PrivateRoute><React.Suspense fallback={<Fallback />}><ExamBuilder /></React.Suspense></PrivateRoute>} />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div style={{
              padding: 80,
              textAlign: 'center',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
              color: '#e2e8f0'
            }}>
              <h1 style={{ fontSize: '4rem', marginBottom: 16 }}>404</h1>
              <p style={{ fontSize: '1.2rem', color: '#a0aec0', marginBottom: 32 }}>Page not found</p>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="btn">Go Home</button>
              </Link>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
