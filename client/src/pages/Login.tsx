import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try{
      const data = await login(email, password);
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    }catch(err: any){
      console.error('Login error:', err);
      const errorMsg = err?.response?.data?.error || err?.message || 'Invalid email or password';
      setError(errorMsg);
      // Clear any existing invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:60,height:60,borderRadius:14,background:'linear-gradient(135deg,#8b5cf6,#7c3aed)',marginBottom:16}}>
            <span style={{fontSize:28,fontWeight:800,color:'white'}}>HB</span>
          </div>
          <h1 style={{fontSize:28,marginBottom:8}}>Welcome Back</h1>
          <p style={{color:'#a0aec0',marginBottom:0}}>Sign in to access your question bank</p>
        </div>

        <form onSubmit={submit} className="card">
          {error && <div className="alert error"><span>⚠️</span> {error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div></div>
            <Link to="/forgot-password" style={{color:'#8b5cf6',fontSize:'0.9rem',textDecoration:'underline'}}>Forgot password?</Link>
          </div>

          <button className="btn" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center'}}>
            {loading? '⏳ Signing in...':'Sign In'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:20}}>
          <p style={{color:'#a0aec0'}}>Don't have an account? <Link to="/register" style={{color:'#8b5cf6',fontWeight:600}}>Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
