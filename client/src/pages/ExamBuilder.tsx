import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';
import Modal from '../components/Modal';

export default function ExamBuilder(){
  const {id} = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [banks, setBanks] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [showAddQuestions, setShowAddQuestions] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');

  useEffect(()=>{
    (async()=>{
      try{
        const examRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/exams/${id}`, {
          headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setExam(examRes.data.exam);
        setSelectedQuestions(examRes.data.exam.questions || []);

        const banksRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks`, {
          headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setBanks(banksRes.data.items || []);
      }catch(err){console.error(err)}
    })();
  },[id]);

  const handleBankSelect = async (bankId: string) => {
    setSelectedBank(bankId);
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/bank/${bankId}`);
      setQuestions(res.data.items || []);
      setFilteredQuestions(res.data.items || []);
    }catch(err){console.error(err)}
  };

  const toggleQuestion = (qId: number) => {
    setSelectedQuestions(s => 
      s.includes(qId) ? s.filter(x=>x!==qId) : [...s, qId]
    );
  };

  const addQuestionsToExam = async () => {
    if(selectedQuestions.length === 0){
      alert('Select at least one question');
      return;
    }
    try{
      await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/exams/${id}/questions`, {
        question_ids: selectedQuestions
      }, {
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setExam(s => ({...s, questions: [...(s.questions||[]), ...selectedQuestions]}));
      setSelectedQuestions([]);
      setShowAddQuestions(false);
      alert('Questions added!');
    }catch(err){
      console.error(err);
      alert('Failed to add questions');
    }
  };

  const removeQuestion = async (qId: number) => {
    try{
      await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/exams/${id}/questions/${qId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setExam(s => ({...s, questions: s.questions.filter(x=>x!==qId)}));
    }catch(err){
      console.error(err);
      alert('Failed to remove question');
    }
  };

  if(!exam) return <Layout><div className="card">Loading...</div></Layout>;

  return (
    <Layout>
      <Link to="/exams" style={{marginBottom:16}}>
        <button className="btn secondary"><AiOutlineArrowLeft/> Back</button>
      </Link>

      <div style={{marginBottom:32}}>
        <h2 style={{marginTop:0}}>{exam.title}</h2>
        <div className="small" style={{color:'#a0aec0'}}>Duration: {exam.duration_minutes} minutes | Questions: {exam.questions?.length || 0}</div>
      </div>

      {exam.questions && exam.questions.length > 0 && (
        <div className="card" style={{marginBottom:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h3 style={{marginTop:0}}>Questions in Exam</h3>
            <button className="btn" onClick={()=>setShowAddQuestions(true)}>
              <AiOutlinePlus/> Add More
            </button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {exam.questions.map((qId:number,idx:number) => (
              <div key={qId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,backgroundColor:'rgba(255,255,255,0.05)',borderRadius:8}}>
                <span>{idx+1}. Question #{qId}</span>
                <button className="btn danger" onClick={()=>removeQuestion(qId)}>
                  <AiOutlineDelete/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!exam.questions || exam.questions.length === 0) && (
        <div className="card" style={{padding:40,textAlign:'center',marginBottom:24}}>
          <div className="small" style={{marginBottom:16,color:'#a0aec0'}}>No questions added to this exam yet</div>
          <button className="btn" onClick={()=>setShowAddQuestions(true)}>
            <AiOutlinePlus/> Add Questions
          </button>
        </div>
      )}

      <Modal open={showAddQuestions} title="Add Questions to Exam" onClose={()=>setShowAddQuestions(false)} maxWidth="600px">
        <div className="form-group">
          <label>Select Question Bank</label>
          <select value={selectedBank} onChange={e=>handleBankSelect(e.target.value)}>
            <option value="">Choose a bank...</option>
            {banks.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {selectedBank && (
          <>
            <div style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <strong>Questions</strong>
                <span className="badge">{selectedQuestions.length} selected</span>
              </div>
              <div style={{maxHeight:'300px',overflowY:'auto',display:'flex',flexDirection:'column',gap:8}}>
                {filteredQuestions.map(q => (
                  <label key={q.id} style={{display:'flex',gap:12,alignItems:'center',padding:12,backgroundColor:'rgba(255,255,255,0.05)',borderRadius:8,cursor:'pointer'}}>
                    <input 
                      type="checkbox" 
                      checked={selectedQuestions.includes(q.id)}
                      onChange={()=>toggleQuestion(q.id)}
                    />
                    <span style={{flex:1}}>
                      <strong>{q.title}</strong><br/>
                      <span className="small" style={{color:'#a0aec0'}}>{q.type} | {q.difficulty}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button className="btn" style={{width:'100%'}} onClick={addQuestionsToExam}>
              Add {selectedQuestions.length} Question{selectedQuestions.length!==1?'s':''}
            </button>
          </>
        )}
      </Modal>
    </Layout>
  );
}
