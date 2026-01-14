import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';

type MCQOption = { id: string; text: string; correct?: boolean };

export default function QuestionEditor(){
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('mcq');
  const [mcqOptions, setMcqOptions] = useState<MCQOption[]>([{id: 'o1', text: ''},{id:'o2',text:''}]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);

  useEffect(()=>{(async ()=>{
    if (!id) { setLoading(false); return; }
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/${id}`);
      const q = res.data.question;
      setTitle(q.title);
      setBody(q.body);
      setType(q.type || 'mcq');
      if (q.attachments) try{ setAttachments(JSON.parse(q.attachments)); }catch(e){ setAttachments([]); }
      if (q.type === 'mcq' && q.answer){
        try{
          const parsed = JSON.parse(q.answer);
          if (Array.isArray(parsed)) setMcqOptions(parsed.map((t:any,i:number)=>({id:`o${i}`,text:t.text,correct:!!t.correct}))); 
        }catch(e){ }
      }
    }catch(err){console.error(err)}finally{setLoading(false)}
  })()},[id]);

  const save = async ()=>{
    const payload:any = { title, body, type };
    if (type === 'mcq') payload.answer = JSON.stringify(mcqOptions.map(o=>({text:o.text, correct: !!o.correct}))); else payload.answer = '';
    if (attachments && attachments.length) payload.attachments = attachments;

    if (id){
      await axios.put(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/${id}`, payload, { headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
    } else {
      // create new sample: requires bankId - for simplicity, create under first bank
      const banks = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks`);
      const bankId = banks.data.items?.[0]?.id;
      if (!bankId) { alert('No bank exists to attach question to'); return; }
      await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions`, { bankId, title, body, answer: payload.answer, type, difficulty: 'medium', attachments }, { headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
    }
    navigate('/questions');
  };

  const addOption = ()=> setMcqOptions(s=>[...s,{id:`o${Date.now()}`,text:''}]);
  const updateOption = (id:string, patch:any)=> setMcqOptions(s=>s.map(o=>o.id===id?({...o,...patch}):o));
  const removeOption = (id:string)=> setMcqOptions(s=>s.filter(o=>o.id!==id));

  const uploadFile = async (file:File)=>{
    const fd = new FormData(); fd.append('file', file);
    const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/uploads`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setAttachments(s=>[...s, res.data]);
  }

  const onFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]; if (f) uploadFile(f);
  }

  const renderPreview = ()=>{
    return (
      <div className="card" style={{marginTop:12}}>
        <h3>Preview</h3>
        <div style={{marginTop:8}} dangerouslySetInnerHTML={{__html: body}} />
        {type === 'mcq' && (
          <div style={{marginTop:12}}>
            <div style={{fontWeight:700}}>Options</div>
            <ul>
              {mcqOptions.map(o=> <li key={o.id} style={{marginTop:6}}>{o.text} {o.correct? <strong>(Correct)</strong>:null}</li>)}
            </ul>
          </div>
        )}
        {attachments.length>0 && (
          <div style={{marginTop:12}}>
            <div style={{fontWeight:700}}>Attachments</div>
            <ul>
              {attachments.map(a=> <li key={a.filename}><a href={a.url} target="_blank" rel="noreferrer">{a.filename}</a></li>)}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout>
      <div>
        <h2>{id? 'Edit Question' : 'New Question'}</h2>
        {loading? <div>Loading...</div> : (
          <div style={{maxWidth:960}}>
            <div style={{marginBottom:8}}>
              <label>Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)'}} />
            </div>
            <div style={{marginBottom:8}}>
              <label>Type</label>
              <select value={type} onChange={e=>setType(e.target.value)} style={{width:200,padding:8,borderRadius:8,marginLeft:12}}>
                <option value="mcq">Multiple Choice</option>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="truefalse">True / False</option>
              </select>
            </div>

            {type === 'mcq' && (
              <div style={{marginBottom:8}}>
                <label>Options</label>
                <div>
                  {mcqOptions.map(opt=> (
                    <div key={opt.id} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                      <input type="checkbox" checked={!!opt.correct} onChange={e=>updateOption(opt.id,{correct:e.target.checked})} />
                      <input value={opt.text} onChange={e=>updateOption(opt.id,{text:e.target.value})} placeholder="Option text" style={{flex:1,padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)'}} />
                      <button className="btn" onClick={()=>removeOption(opt.id)} type="button">Delete</button>
                    </div>
                  ))}
                  <div><button type="button" className="btn" onClick={addOption}>Add option</button></div>
                </div>
              </div>
            )}

            <div style={{marginBottom:8}}>
              <label>Body</label>
              <ReactQuill theme="snow" value={body} onChange={setBody} />
            </div>

            <div style={{marginBottom:8}}>
              <label>Attachments</label>
              <div style={{display:'flex',gap:8,alignItems:'center',marginTop:6}}>
                <input type="file" onChange={onFileChange} />
              </div>
              <div style={{marginTop:8}}>
                {attachments.map(a=> (
                  <div key={a.filename} style={{display:'flex',gap:8,alignItems:'center'}}>
                    <a href={a.url} target="_blank" rel="noreferrer">{a.filename}</a>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <button className="btn" onClick={()=>setPreview(p=>!p)} style={{marginRight:8}}>{preview? 'Hide Preview':'Preview'}</button>
              </div>
              <div style={{textAlign:'right'}}>
                {id && <button className="btn danger" style={{marginRight:8}} onClick={async ()=>{
                  if (!confirm('Delete this question?')) return;
                  try{
                    await axios.delete(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/questions/${id}`, { headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
                    navigate('/questions');
                  }catch(err){ console.error(err); alert('Failed to delete'); }
                }}>Delete</button>}
                <button className="btn" onClick={save}>Save</button>
              </div>
            </div>
            {preview && renderPreview()}
          </div>
        )}
      </div>
    </Layout>
  );
}
