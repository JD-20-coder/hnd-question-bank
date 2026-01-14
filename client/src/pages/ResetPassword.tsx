import React, { useState } from 'react';
import { resetPassword } from '../services/auth';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword(){
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try{
      await resetPassword(token, newPassword);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(()=>navigate('/login'), 2000);
    }catch(err: any){
      console.error('Reset password error:', err);
      const errorMsg = err?.response?.data?.error || err?.message || 'Failed to reset password. The link may have expired.';
      setError(errorMsg);
    }finally{
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <div style={{maxWidth:420}}>
          <div className="card">
            <div className="alert error">
              <span>⚠️</span> Invalid or missing reset token. Please request a new password reset link.
            </div>
            <Link to="/forgot-password" className="btn" style={{width:'100%',justifyContent:'center',marginTop:16}}>
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:60,height:60,borderRadius:14,background:'linear-gradient(135deg,#8b5cf6,#7c3aed)',marginBottom:16}}>
            <span style={{fontSize:28,fontWeight:800,color:'white'}}>HB</span>
          </div>
          <h1 style={{fontSize:28,marginBottom:8}}>Reset Password</h1>
          <p style={{color:'#a0aec0',marginBottom:0}}>Enter your new password</p>
        </div>

        <form onSubmit={submit} className="card">
          {error && <div className="alert error"><span>⚠️</span> {error}</div>}
          {message && <div className="alert" style={{background:'rgba(16,185,129,0.1)',color:'#10b981',border:'1px solid rgba(16,185,129,0.2)'}}><span>✓</span> {message}</div>}

          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e=>setNewPassword(e.target.value)} 
              placeholder="At least 6 characters"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e=>setConfirmPassword(e.target.value)} 
              placeholder="Re-enter your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button className="btn" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center'}}>
            {loading? '⏳ Resetting...':'Reset Password'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:20}}>
          <p style={{color:'#a0aec0'}}>Remember your password? <Link to="/login" style={{color:'#8b5cf6',fontWeight:600}}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
