import React, { useState } from 'react';

export default function BankForm({initial, onSubmit}:{initial?:any,onSubmit:(data:any)=>Promise<void>}){
  const [title, setTitle] = useState(initial?.title||'');
  const [description, setDescription] = useState(initial?.description||'');
  const [error, setError] = useState<string|null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!title.trim()){setError('Title is required');return}
    setBusy(true);
    setError(null);
    try{
      await onSubmit({title,description});
    }catch(err:any){
      setError(err?.response?.data?.error||'Failed to save');
    }finally{setBusy(false)}
  };
  return (
    <form onSubmit={submit}>
      {error && <div className="alert error" style={{marginBottom:16}}><span>⚠️</span> {error}</div>}
      <div className="form-group">
        <label>Title *</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., Biology A-Level" required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Brief description of this question bank..." />
      </div>
      <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
        <button className="btn ghost" type="reset">Clear</button>
        <button className="btn" type="submit" disabled={busy}>{busy? '⏳ Saving...':'Save Bank'}</button>
      </div>
    </form>
  );
}
