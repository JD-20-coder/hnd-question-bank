import React, { useState } from 'react';
import { register } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if(!fullName.trim()){setError('Name is required');return}
    if(password.length<6){setError('Password must be at least 6 characters');return}
    
    setLoading(true);
    try{
      const data = await register(email, password, fullName);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      navigate('/dashboard');
    }catch(err: any){
      setError(err?.response?.data?.error || 'Registration failed');
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
          <h1 style={{fontSize:28,marginBottom:8}}>Create Account</h1>
          <p style={{color:'#a0aec0',marginBottom:0}}>Join us and start managing question banks</p>
        </div>

        <form onSubmit={submit} className="card">
          {error && <div className="alert error"><span>⚠️</span> {error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Jerome Depp" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" required />
          </div>

          <button className="btn" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center'}}>
            {loading? '⏳ Creating Account...':'Create Account'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:20}}>
          <p style={{color:'#a0aec0'}}>Already have an account? <Link to="/login" style={{color:'#8b5cf6',fontWeight:600}}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
