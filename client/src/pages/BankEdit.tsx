import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import BankForm from '../components/BankForm';
import { useParams, useNavigate } from 'react-router-dom';

export default function BankEdit(){
  const { id } = useParams();
  const [bank, setBank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{(async ()=>{
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks/${id}`);
      setBank(res.data.bank);
    }catch(err){console.error(err)}finally{setLoading(false)}
  })()},[id]);

  const save = async (data:any)=>{
    await axios.put(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/banks/${id}`, data, { headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
    navigate(`/banks/${id}`);
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (!bank) return <Layout><div>Not found</div></Layout>;

  return (
    <Layout>
      <h2>Edit bank</h2>
      <div style={{maxWidth:720}}>
        <BankForm initial={bank} onSubmit={save} />
      </div>
    </Layout>
  );
}
