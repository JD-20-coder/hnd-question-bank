import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';

export default function BankDetail(){
  const { id } = useParams();
  const [bank, setBank] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQ, setNewQ] = useState({title:'',body:'',difficulty:'medium',type:'mcq'});
  const navigate = useNavigate();

  const fetchBank = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks/${id}`);
      setBank(res.data.bank);
      
      const qRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/bank/${id}`);
      setQuestions(qRes.data.items || []);
    }catch(err){console.error(err)}finally{setLoading(false)}
  };

  useEffect(()=>{ fetchBank(); },[id]);

  const deleteBank = async () => {
    if (!confirm('Delete this bank? All questions will be deleted. This cannot be undone.')) return;
    try{
      await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks/${id}`, { 
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
      });
      navigate('/banks');
    }catch(err){
      console.error(err);
      alert('Failed to delete');
    }
  };

  const deleteQuestion = async (qId:number) => {
    if (!confirm('Delete this question?')) return;
    try{
      await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/${qId}`, { 
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
      });
      setQuestions(s=>s.filter(q=>q.id !== qId));
    }catch(err){ 
      console.error(err); 
      alert('Failed to delete'); 
    }
  };

  const createQuestion = async () => {
    if(!newQ.title.trim()){alert('Title required');return}
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions`, {
        ...newQ,
        bankId: Number(id)
      }, { 
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
      });
      // Refresh questions list after creation
      fetchBank();
      setNewQ({title:'',body:'',difficulty:'medium',type:'mcq'});
      setShowNewQuestion(false);
    }catch(err: any){
      console.error(err);
      const errorMsg = err?.response?.data?.error || 'Failed to create question';
      alert(errorMsg);
    }
  };

  if (loading) return <Layout><div className="card">Loading...</div></Layout>;
  if (!bank) return <Layout><div className="card">Bank not found</div></Layout>;

  return (
    <Layout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:24}}>
        <div style={{flex:1}}>
          <h2 style={{marginBottom:8}}>{bank.title}</h2>
          <p style={{color:'#a0aec0',marginBottom:0}}>{bank.description}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn secondary" onClick={()=>navigate(`/banks/${id}/edit`)}>
            <AiOutlineEdit/> Edit
          </button>
          <button className="btn danger" onClick={deleteBank}>
            <AiOutlineDelete/> Delete
          </button>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h3 style={{marginTop:0}}>Questions ({questions.length})</h3>
        <button className="btn" onClick={()=>setShowNewQuestion(true)}>
          <AiOutlinePlus/> Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="card" style={{padding:40,textAlign:'center'}}>
          <div className="small" style={{marginBottom:12}}>No questions in this bank</div>
          <button className="btn" onClick={()=>setShowNewQuestion(true)}>Create the first one</button>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {questions.map(q => (
            <div key={q.id} className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,marginBottom:6}}>{q.title}</div>
                  <div className="small" style={{marginBottom:8}}>{q.body?.slice(0,150)}...</div>
                  <div style={{display:'flex',gap:12}}>
                    <span style={{background:'rgba(139,92,246,0.1)',color:'#8b5cf6',padding:'4px 8px',borderRadius:6,fontSize:12,fontWeight:500}}>
                      {q.type}
                    </span>
                    <span style={{background:'rgba(16,185,129,0.1)',color:'#10b981',padding:'4px 8px',borderRadius:6,fontSize:12,fontWeight:500}}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <Link to={`/questions/${q.id}`}><button className="btn secondary">Edit</button></Link>
                  <button className="btn danger" onClick={()=>deleteQuestion(q.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showNewQuestion} title="Add Question" onClose={()=>setShowNewQuestion(false)}>
        <div className="form-group">
          <label>Title</label>
          <input value={newQ.title} onChange={e=>setNewQ({...newQ,title:e.target.value})} placeholder="Question title" />
        </div>
        <div className="form-group">
          <label>Body</label>
          <textarea value={newQ.body} onChange={e=>setNewQ({...newQ,body:e.target.value})} placeholder="Question description" />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="form-group">
            <label>Type</label>
            <select value={newQ.type} onChange={e=>setNewQ({...newQ,type:e.target.value})}>
              <option value="mcq">Multiple Choice</option>
              <option value="short">Short Answer</option>
              <option value="long">Long Answer</option>
              <option value="truefalse">True/False</option>
            </select>
          </div>
          <div className="form-group">
            <label>Difficulty</label>
            <select value={newQ.difficulty} onChange={e=>setNewQ({...newQ,difficulty:e.target.value})}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <button className="btn" style={{width:'100%'}} onClick={createQuestion}>Create Question</button>
      </Modal>
    </Layout>
  );
}
