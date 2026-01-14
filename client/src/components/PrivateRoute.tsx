import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../services/user';

export default function PrivateRoute({children}:{children:React.ReactNode}){
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(()=>{
    (async ()=>{
      const token = localStorage.getItem('accessToken');
      if (!token) { setAuthed(false); setLoading(false); return; }
      try{
        await getMe(token);
        setAuthed(true);
      }catch(err){
        setAuthed(false);
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }finally{setLoading(false)}
    })();
  },[]);

  if (loading) return <div style={{padding: 48, textAlign: 'center'}}>Checking auth...</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
