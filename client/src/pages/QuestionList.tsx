import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

export default function QuestionList(){
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [type, setType] = useState('all');

  useEffect(()=>{(async ()=>{
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions`);
      setItems(res.data.items||[]);
    }catch(err){console.error(err)}finally{setLoading(false)}
  })()},[]);

  // Filter logic
  useEffect(()=>{
    let filtered = items;

    if(search.trim()){
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.body.toLowerCase().includes(search.toLowerCase())
      );
    }

    if(difficulty !== 'all'){
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    if(type !== 'all'){
      filtered = filtered.filter(q => q.type === type);
    }

    setFilteredItems(filtered);
  },[items, search, difficulty, type]);

  const deleteQuestion = async (id:number) => {
    if(!confirm('Delete this question?')) return;
    try{
      await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/${id}`, { 
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
      });
      setItems(s => s.filter(q => q.id !== id));
    }catch(err){ 
      console.error(err); 
      alert('Failed to delete'); 
    }
  };

  const getDifficultyColor = (d:string) => {
    if(d==='easy') return {bg:'rgba(16,185,129,0.1)',color:'#10b981'};
    if(d==='medium') return {bg:'rgba(245,158,11,0.1)',color:'#f59e0b'};
    return {bg:'rgba(239,68,68,0.1)',color:'#ef4444'};
  };

  return (
    <Layout>
      <div style={{marginBottom:24}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{marginTop:0}}>Questions</h2>
          <Link to="/banks"><button className="btn">← Back to Banks</button></Link>
        </div>

        <div className="card" style={{padding:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            <div>
              <label className="small" style={{display:'block',marginBottom:8}}>Search</label>
              <div style={{position:'relative'}}>
                <AiOutlineSearch style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#718096'}}/>
                <input 
                  value={search} 
                  onChange={e=>setSearch(e.target.value)} 
                  placeholder="Search questions..." 
                  style={{paddingLeft:36,width:'100%'}}
                />
              </div>
            </div>
            <div>
              <label className="small" style={{display:'block',marginBottom:8}}>Difficulty</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="small" style={{display:'block',marginBottom:8}}>Type</label>
              <select value={type} onChange={e=>setType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="mcq">Multiple Choice</option>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="truefalse">True/False</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="card">Loading questions...</div>
        ) : filteredItems.length === 0 ? (
          <div className="card" style={{padding:40,textAlign:'center'}}>
            <div className="small" style={{marginBottom:12}}>
              {items.length === 0 ? 'No questions yet' : 'No questions match your filters'}
            </div>
            <Link to="/banks"><button className="btn">Browse Banks</button></Link>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="small" style={{color:'#a0aec0'}}>
              Showing {filteredItems.length} of {items.length} questions
            </div>
            {filteredItems.map(q => {
              const diffColor = getDifficultyColor(q.difficulty);
              return (
                <div key={q.id} className="card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,marginBottom:6}}>{q.title}</div>
                      <div className="small" style={{marginBottom:12,color:'#a0aec0'}}>
                        {q.body?.slice(0,200)}...
                      </div>
                      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                        <span style={{
                          background:'rgba(139,92,246,0.1)',
                          color:'#8b5cf6',
                          padding:'4px 10px',
                          borderRadius:6,
                          fontSize:12,
                          fontWeight:500
                        }}>
                          {q.type}
                        </span>
                        <span style={{
                          background:diffColor.bg,
                          color:diffColor.color,
                          padding:'4px 10px',
                          borderRadius:6,
                          fontSize:12,
                          fontWeight:500
                        }}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,marginLeft:16}}>
                      <Link to={`/questions/${q.id}`}><button className="btn secondary" title="Edit"><AiOutlineEdit/></button></Link>
                      <button className="btn danger" onClick={()=>deleteQuestion(q.id)} title="Delete"><AiOutlineDelete/></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
