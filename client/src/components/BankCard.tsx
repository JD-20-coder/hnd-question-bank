import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BankCard({bank}:{bank:any}){
  const nav = useNavigate();
  return (
    <div className="bank-card card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
        <div style={{flex:1}}>
          <h4 style={{margin:'0 0 6px 0',fontSize:16}}>{bank.title}</h4>
          <div className="small muted-2" style={{marginBottom:8}}>{bank.description}</div>
          <div className="small">{bank.questions_count ?? 0} questions</div>
        </div>
        <div style={{textAlign:'right',minWidth:120}}>
          <div className="small muted">{(bank.created_at||'').split('T')?.[0] || ''}</div>
          <div style={{marginTop:10,display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn" onClick={()=>nav(`/banks/${bank.id}`)}>Open</button>
            <button className="btn secondary" onClick={()=>nav(`/banks/${bank.id}/edit`)}>Edit</button>
            <button className="btn danger" onClick={async ()=>{
              if (!confirm('Delete this bank? This cannot be undone.')) return;
              try{
                await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks/${bank.id}`, { headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
                // simple refresh to update list
                window.location.reload();
              }catch(err){
                console.error(err);
                alert('Failed to delete');
              }
            }}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
