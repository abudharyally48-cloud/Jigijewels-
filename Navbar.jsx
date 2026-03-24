import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '14px 80px' : '26px 80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,8,6,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,151,58,0.08)' : 'none',
        transition: 'all 0.4s',
      }}>
        <Link to="/" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <span style={{ display: 'block', fontFamily: 'Cinzel,serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--cream)', letterSpacing: 6, textTransform: 'uppercase' }}>Jigi Jewels</span>
          <span style={{ display: 'block', fontSize: '0.42rem', letterSpacing: 8, textTransform: 'uppercase', color: 'var(--gold)', marginTop: 2 }}>Luxury Jewelry · Enugu</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 36, listStyle: 'none', alignItems: 'center' }} className="nav-links-desktop">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About']].map(([to, label]) => (
            <li key={to}>
              <Link to={to} style={{
                color: location.pathname === to ? 'var(--gold)' : 'var(--gray)',
                fontSize: '0.58rem', letterSpacing: 5, textTransform: 'uppercase',
                fontWeight: 300, textDecoration: 'none', transition: 'color 0.3s',
              }}>{label}</Link>
            </li>
          ))}
          <li>
            <a href="https://wa.me/2348072154424" target="_blank" rel="noreferrer" style={{
              border: '1px solid rgba(201,151,58,0.4)', color: 'var(--gold)',
              padding: '9px 24px', fontSize: '0.56rem', letterSpacing: 3,
              textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.target.style.background = 'var(--gold)'; e.target.style.color = 'var(--bg)'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--gold)'; }}
            >Shop Now</a>
          </li>
        </ul>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)} style={{
          display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer',
        }} className="nav-ham">
          {[0,1,2].map(i => <span key={i} style={{ width: 22, height: 1, background: 'var(--cream)', display: 'block' }} />)}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(10,8,6,0.99)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40,
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 24, right: 28, background: 'none', border: 'none',
            color: 'var(--cream)', fontSize: '1.8rem', cursor: 'pointer',
          }}>✕</button>
          {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About']].map(([to, label]) => (
            <Link key={to} to={to} style={{
              fontFamily: 'Cinzel,serif', fontSize: '2rem', color: 'var(--cream)',
              letterSpacing: 4, textDecoration: 'none',
            }}>{label}</Link>
          ))}
          <a href="https://wa.me/2348072154424" target="_blank" rel="noreferrer" className="btn-gold" style={{ marginTop: 8 }}>
            Shop on WhatsApp
          </a>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .nav-links-desktop{display:none!important;}
          .nav-ham{display:flex!important;}
          nav{padding:14px 20px!important;}
        }
      `}</style>
    </>
  );
}
