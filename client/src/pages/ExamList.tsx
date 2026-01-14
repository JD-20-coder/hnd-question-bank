import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Modal from '../components/Modal';

export default function ExamList(){
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newExam, setNewExam] = useState({title:'',duration_minutes:60});

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/exams`);
        setExams(res.data.items || []);
      }catch(err){console.error(err)}finally{setLoading(false)}
    })();
  },[]);

  const createExam = async () => {
    if(!newExam.title.trim()){alert('Title required');return}
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/exams`, newExam, {
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setExams([...exams, res.data.exam]);
      setNewExam({title:'',duration_minutes:60});
      setShowCreate(false);
    }catch(err){
      console.error(err);
      alert('Failed to create exam');
    }
  };

  const deleteExam = async (id:number) => {
    if(!confirm('Delete this exam?')) return;
    try{
      await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/exams/${id}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setExams(s => s.filter(e => e.id !== id));
    }catch(err){
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <Layout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{marginTop:0}}>Exam Sessions</h2>
        <button className="btn" onClick={()=>setShowCreate(true)}>
          <AiOutlinePlus/> Create Exam
        </button>
      </div>

      {loading ? (
        <div className="card">Loading exams...</div>
      ) : exams.length === 0 ? (
        <div className="card" style={{padding:40,textAlign:'center'}}>
          <div className="small" style={{marginBottom:12}}>No exams created yet</div>
          <button className="btn" onClick={()=>setShowCreate(true)}>Create your first exam</button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {exams.map(exam => (
            <div key={exam.id} className="card">
              <div style={{marginBottom:12}}>
                <h3 style={{marginTop:0,marginBottom:6}}>{exam.title}</h3>
                <div className="small" style={{color:'#a0aec0'}}>
                  Duration: {exam.duration_minutes} minutes
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <Link to={`/exams/${exam.id}`} style={{flex:1}}>
                  <button className="btn secondary" style={{width:'100%'}}>
                    <AiOutlineEdit/> Edit
                  </button>
                </Link>
                <button className="btn danger" onClick={()=>deleteExam(exam.id)}>
                  <AiOutlineDelete/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} title="Create New Exam" onClose={()=>setShowCreate(false)}>
        <div className="form-group">
          <label>Exam Title</label>
          <input 
            value={newExam.title} 
            onChange={e=>setNewExam({...newExam,title:e.target.value})} 
            placeholder="e.g., Mid-term Exam" 
          />
        </div>
        <div className="form-group">
          <label>Duration (minutes)</label>
          <input 
            type="number"
            value={newExam.duration_minutes} 
            onChange={e=>setNewExam({...newExam,duration_minutes:parseInt(e.target.value)||60})} 
            min="15"
            max="480"
          />
        </div>
        <button className="btn" style={{width:'100%'}} onClick={createExam}>Create Exam</button>
      </Modal>
    </Layout>
  );
}
