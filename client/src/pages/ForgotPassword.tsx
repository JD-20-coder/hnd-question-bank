import React, { useState } from 'react';
import { forgotPassword } from '../services/auth';
import { Link } from 'react-router-dom';

export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try{
      await forgotPassword(email);
      setMessage('If an account exists with this email, a password reset link has been sent.');
    }catch(err: any){
      console.error('Forgot password error:', err);
      const errorMsg = err?.response?.data?.error || err?.message || 'Failed to send reset email. Please try again.';
      setError(errorMsg);
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
          <h1 style={{fontSize:28,marginBottom:8}}>Forgot Password</h1>
          <p style={{color:'#a0aec0',marginBottom:0}}>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={submit} className="card">
          {error && <div className="alert error"><span>⚠️</span> {error}</div>}
          {message && <div className="alert" style={{background:'rgba(16,185,129,0.1)',color:'#10b981',border:'1px solid rgba(16,185,129,0.2)'}}><span>✓</span> {message}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required 
              disabled={loading}
            />
          </div>

          <button className="btn" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center'}}>
            {loading? '⏳ Sending...':'Send Reset Link'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:20}}>
          <p style={{color:'#a0aec0'}}>Remember your password? <Link to="/login" style={{color:'#8b5cf6',fontWeight:600}}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
