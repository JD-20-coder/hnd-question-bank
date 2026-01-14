import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function getMe(token?: string) {
  const headers: any = {};
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await axios.get(`${API_BASE}/users/me`, { headers });
  return res.data.user;
}
