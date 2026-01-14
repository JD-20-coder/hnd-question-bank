import React, { useEffect, useState } from 'react';
import { getMe } from '../services/user';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineSearch } from 'react-icons/ai';

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const [q, setQ] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const u = await getMe(token);
        setUser(u);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setShowUserMenu(false);
    window.location.href = '/';
  };

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/questions?q=${encodeURIComponent(q)}`);
    }
  };

  const initials = (name?: string, email?: string) => {
    const src = name || email || '';
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'G';
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
  };

  return (
    <div className="topbar">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <AiOutlineSearch
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#718096',
              pointerEvents: 'none',
            }}
          />
          <input
            className="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onSearchKey}
            placeholder="Search banks, questions..."
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
                border: 'none',
                color: 'white',
                width: 40,
                height: 40,
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              {initials(user.full_name, user.email)}
            </button>
            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 50,
                  right: 0,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  minWidth: 200,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    color: '#a0aec0',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#e2e8f0' }}>
                    {user.full_name || 'User'}
                  </div>
                  <div>{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'none')
                  }
                >
                  <AiOutlineLogout size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}