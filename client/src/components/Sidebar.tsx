import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineDashboard, AiOutlineFolder, AiOutlineQuestion, AiOutlineUser, AiOutlineFileText } from 'react-icons/ai';

export default function Sidebar(){
  return (
    <aside>
      <div className="brand">
        <div className="logo" style={{display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>HB</div>
        <div>
          <h3 style={{margin:0,fontSize:18}}>HND Question Bank</h3>
          <div className="small muted-2">Academic resources</div>
        </div>
      </div>

      <nav>
        <NavLink to="/dashboard" className={({isActive})=> 'nav-link'+(isActive? ' active':'')}><AiOutlineDashboard style={{marginRight:8}}/> Dashboard</NavLink>
        <NavLink to="/banks" className={({isActive})=> 'nav-link'+(isActive? ' active':'')}><AiOutlineFolder style={{marginRight:8}}/> Banks</NavLink>
        <NavLink to="/questions" className={({isActive})=> 'nav-link'+(isActive? ' active':'')}><AiOutlineQuestion style={{marginRight:8}}/> Questions</NavLink>
        <NavLink to="/exams" className={({isActive})=> 'nav-link'+(isActive? ' active':'')}><AiOutlineFileText style={{marginRight:8}}/> Exams</NavLink>
        <NavLink to="/users" className={({isActive})=> 'nav-link'+(isActive? ' active':'')}><AiOutlineUser style={{marginRight:8}}/> Users</NavLink>
      </nav>

      <div className="pro-card">
        <div className="card small" style={{padding:14}}>
          <div style={{fontWeight:700, marginBottom:6}}>Pro Features</div>
          <div className="small">Create exam sessions, analytics and downloadable reports.</div>
          <div style={{marginTop:12}}><button className="btn ghost">Learn More</button></div>
        </div>
      </div>
    </aside>
  );
}
