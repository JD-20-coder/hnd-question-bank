import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import BankCard from '../components/BankCard';
import Modal from '../components/Modal';
import BankForm from '../components/BankForm';
import { useNavigate } from 'react-router-dom';

export default function BankList(){
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{(async ()=>{
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks`);
      setBanks(res.data.items||[]);
    }catch(err){console.error(err)}finally{setLoading(false)}
  })()},[]);

  const create = async (data:any)=>{
    const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks`, data, { headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
    setBanks([...(banks||[]), {id: res.data.id, ...data, created_at: new Date().toISOString()}]);
    setOpen(false);
  };

  return (
    <Layout>
      <div style={{marginBottom: 32}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom: 24}}>
          <div>
            <h2 style={{margin: 0, fontSize: '2rem', fontWeight: 700, color: '#e2e8f0'}}>Question Banks</h2>
            <p style={{margin: '8px 0 0', color: '#a0aec0', fontSize: '0.95rem'}}>
              {banks.length > 0 ? `${banks.length} bank${banks.length !== 1 ? 's' : ''} available` : 'Create and manage your question banks'}
            </p>
          </div>
          <button className="btn" onClick={()=>setOpen(true)} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            + Create Bank
          </button>
        </div>

        {loading ? (
          <div className="card" style={{textAlign: 'center', padding: 60}}>
            <div style={{ 
              width: 48, 
              height: 48, 
              border: '4px solid rgba(139,92,246,0.2)',
              borderTopColor: '#8b5cf6',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{color: '#a0aec0'}}>Loading banks...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : banks.length === 0 ? (
          <div className="card" style={{textAlign: 'center', padding: 60}}>
            <div style={{fontSize: 64, marginBottom: 20, filter: 'grayscale(1)', opacity: 0.5}}>📚</div>
            <h3 style={{marginBottom: 12, color: '#e2e8f0'}}>No question banks yet</h3>
            <p style={{marginBottom: 32, color: '#a0aec0', maxWidth: '400px', margin: '0 auto 32px'}}>
              Create your first question bank to organize and manage your questions
            </p>
            <button className="btn" onClick={()=>setOpen(true)}>
              Create your first bank
            </button>
          </div>
        ) : (
          <div className="grid" style={{gap: 20}}>
            {banks.map(b => <BankCard key={b.id} bank={b} />)}
          </div>
        )}
      </div>

      <Modal open={open} title="Create Bank" onClose={()=>setOpen(false)}>
        <BankForm onSubmit={create} />
      </Modal>
    </Layout>
  );
}
