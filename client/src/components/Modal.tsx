import React from 'react';

export default function Modal({open, title, onClose, children}:{open:boolean,title?:string,onClose?:()=>void,children?:React.ReactNode}){
  if(!open) return null;
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:60}}>
      <div style={{position:'absolute',inset:0,background:'rgba(3,7,18,0.6)'}} onClick={onClose}></div>
      <div style={{position:'relative',zIndex:70,minWidth:320,maxWidth:760}} className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:700}}>{title}</div>
          <button className="btn ghost" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
