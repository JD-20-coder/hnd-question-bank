import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }:{children: React.ReactNode}){
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <main className="main">
        <Topbar />
        <div style={{marginTop:12}}>{children}</div>
      </main>
    </div>
  );
}
