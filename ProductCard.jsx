import { Link } from 'react-router-dom';

export default function ProductCard({ product, delay = 0 }) {
  const photo = product.primary_photo || null;

  return (
    <Link to={`/shop/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}
      className="fade-up" style2={{ animationDelay: `${delay}s` }}>
      <div style={{
        position: 'relative', overflow: 'hidden', background: 'var(--bg2)',
        cursor: 'pointer', transition: 'transform 0.4s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 300 }}>
          {photo ? (
            <img src={photo} alt={product.name} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'saturate(0.75) brightness(0.72)',
              transition: 'transform 0.7s, filter 0.5s',
              display: 'block',
            }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'saturate(0.9) brightness(0.85)'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'saturate(0.75) brightness(0.72)'; }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', background: 'var(--bg3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--gray)', fontSize: '0.6rem', letterSpacing: 3 }}>NO IMAGE</span>
            </div>
          )}
          {/* Overlay gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,8,6,0.85) 0%, transparent 55%)',
          }} />
          {/* Category tag */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(10,8,6,0.7)', border: '1px solid rgba(201,151,58,0.3)',
            color: 'var(--gold)', fontSize: '0.48rem', letterSpacing: 4,
            textTransform: 'uppercase', padding: '5px 10px',
          }}>{product.category}</div>
          {product.is_featured && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              background: 'var(--gold)', color: 'var(--bg)',
              fontSize: '0.42rem', letterSpacing: 3, textTransform: 'uppercase', padding: '5px 10px',
              fontWeight: 600,
            }}>Featured</div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '20px 20px 22px' }}>
          <div style={{
            fontFamily: 'Cinzel,serif', fontSize: '0.95rem', fontWeight: 600,
            color: 'var(--cream)', letterSpacing: 2, marginBottom: 8,
          }}>{product.name}</div>
          {product.description && (
            <p style={{
              color: 'var(--gray)', fontSize: '0.72rem', lineHeight: 1.7,
              fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{product.description}</p>
          )}
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--gold)', fontSize: '0.56rem', letterSpacing: 3, textTransform: 'uppercase',
          }}>
            View Piece <span style={{ fontSize: '0.8rem' }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
