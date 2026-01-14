import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function register(email: string, password: string, full_name?: string) {
  const res = await axios.post(`${API_BASE}/auth/register`, { email, password, full_name });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
}

export async function refresh(refreshToken: string) {
  const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
  return res.data;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await axios.post(`${API_BASE}/auth/reset-password`, { token, newPassword });
  return res.data;
}
