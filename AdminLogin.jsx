import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) return setError('Enter credentials');
    setLoading(true); setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background rings */}
      {[400, 600].map(s => (
        <div key={s} style={{
          position: 'fixed', width: s, height: s,
          border: `1px solid rgba(201,151,58,${s === 400 ? 0.06 : 0.03})`,
          borderRadius: '50%', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        }} />
      ))}

      <div className="fade-up" style={{
        background: 'var(--bg2)', border: '1px solid rgba(201,151,58,0.15)',
        padding: '52px 48px', maxWidth: 380, width: '100%', textAlign: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.1rem', letterSpacing: 6, color: 'var(--gold)', marginBottom: 4, textTransform: 'uppercase' }}>
          Jigi Jewels
        </div>
        <div style={{ fontSize: '0.5rem', letterSpacing: 5, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 40 }}>
          Admin Dashboard
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,151,58,0.12)',
            color: 'var(--cream)', padding: '13px 16px', fontSize: '0.82rem',
            outline: 'none', marginBottom: 10, letterSpacing: 1,
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,151,58,0.12)',
            color: 'var(--cream)', padding: '13px 16px', fontSize: '0.82rem',
            outline: 'none', marginBottom: 16, letterSpacing: 1,
          }}
        />

        <button onClick={handleLogin} disabled={loading} className="btn-gold" style={{
          width: '100%', justifyContent: 'center', fontFamily: 'Cinzel,serif',
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Signing In...' : 'Access Dashboard'}
        </button>

        {error && (
          <p style={{ color: 'var(--red)', fontSize: '0.65rem', marginTop: 14, letterSpacing: 1 }}>{error}</p>
        )}

        <a href="/" style={{ display: 'block', marginTop: 24, color: 'var(--gray)', fontSize: '0.58rem', letterSpacing: 3, textTransform: 'uppercase' }}>
          ← Back to Site
        </a>
      </div>
    </div>
  );
}
