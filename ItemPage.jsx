import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, createOrder } from '../api';
import { useTrackVisit } from '../hooks/useTrackVisit';

export default function ItemPage() {
  useTrackVisit();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    getProduct(id).then(r => {
      setProduct(r.data);
      const primaryIdx = r.data.photos.findIndex(p => p.is_primary);
      setActivePhoto(primaryIdx >= 0 ? primaryIdx : 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--gray)' }}>Product not found.</p>
      <Link to="/shop" className="btn-gold">Back to Shop</Link>
    </div>
  );

  const photos = product.photos || [];
  const currentPhoto = photos[activePhoto];
  const waText = product.whatsapp_text || `Hi, I would like to order ${product.name} from Jigi Jewels. Can you help me?`;
  const waUrl = `https://wa.me/2348072154424?text=${encodeURIComponent(waText)}`;

  const handleOrder = () => {
    // Log the order
    createOrder({
      product_id: product.id,
      product_name: product.name,
      message: waText,
    }).catch(() => {});
    window.open(waUrl, '_blank');
  };

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '20px 80px', borderBottom: '1px solid rgba(201,151,58,0.06)', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.58rem', color: 'var(--gray)', letterSpacing: 2 }}>
          <Link to="/" style={{ color: 'var(--gray)', transition: 'color 0.2s' }}>Home</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: 'var(--gray)' }}>Shop</Link>
          <span>›</span>
          <span style={{ color: 'var(--gold)' }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
        {/* Photo gallery */}
        <div>
          {/* Main photo */}
          <div style={{
            position: 'relative', overflow: 'hidden', background: 'var(--bg2)',
            cursor: photos.length ? 'zoom-in' : 'default',
            marginBottom: 12,
          }} onClick={() => photos.length && setLightbox(true)}>
            {currentPhoto ? (
              <img src={currentPhoto.url} alt={product.name} style={{
                width: '100%', height: 500, objectFit: 'cover', display: 'block',
                filter: 'saturate(0.85) brightness(0.82)',
              }} />
            ) : (
              <div style={{ width: '100%', height: 500, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--gray)', fontSize: '0.6rem', letterSpacing: 3 }}>NO IMAGE</span>
              </div>
            )}
            {photos.length > 1 && (
              <div style={{
                position: 'absolute', bottom: 14, right: 14,
                background: 'rgba(10,8,6,0.7)', color: 'var(--gold)',
                fontSize: '0.52rem', letterSpacing: 2, padding: '5px 10px',
              }}>⊕ Zoom</div>
            )}
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {photos.map((ph, i) => (
                <div key={ph.id} onClick={() => setActivePhoto(i)} style={{
                  width: 72, height: 72, overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${i === activePhoto ? 'var(--gold)' : 'transparent'}`,
                  transition: 'border-color 0.2s', opacity: i === activePhoto ? 1 : 0.6,
                }}>
                  <img src={ph.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="fade-up">
          <div style={{
            display: 'inline-block', background: 'rgba(201,151,58,0.1)',
            border: '1px solid rgba(201,151,58,0.25)', color: 'var(--gold)',
            fontSize: '0.52rem', letterSpacing: 5, textTransform: 'uppercase',
            padding: '6px 14px', marginBottom: 24,
          }}>{product.category}</div>

          <h1 style={{
            fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)',
            fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase',
            color: 'var(--cream)', lineHeight: 1.2, marginBottom: 28,
          }}>{product.name}</h1>

          {product.description && (
            <p style={{
              color: 'var(--lgray)', fontSize: '0.88rem', lineHeight: 2,
              fontWeight: 300, marginBottom: 32,
            }}>{product.description}</p>
          )}

          <div style={{ width: 48, height: 1, background: 'var(--gold)', marginBottom: 32 }} />

          <div style={{
            background: 'var(--bg2)', border: '1px solid rgba(201,151,58,0.1)',
            padding: '20px 24px', marginBottom: 32,
          }}>
            <div style={{ fontSize: '0.52rem', letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>To Order</div>
            <p style={{ color: 'var(--lgray)', fontSize: '0.78rem', lineHeight: 1.7, fontWeight: 300 }}>
              Tap the button below to chat with us on WhatsApp. We'll confirm availability, discuss details, and arrange delivery.
            </p>
          </div>

          <button onClick={handleOrder} style={{
            width: '100%', background: '#25D366', color: '#fff',
            border: 'none', padding: '18px 32px', fontSize: '0.78rem',
            letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 12, transition: 'background 0.3s',
            fontFamily: 'Cinzel,serif',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1da855'}
            onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order on WhatsApp
          </button>

          <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 20, color: 'var(--gray)', fontSize: '0.6rem', letterSpacing: 3, textTransform: 'uppercase' }}>
            ← Back to Shop
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && currentPhoto && (
        <div onClick={() => setLightbox(false)} style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.97)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <button onClick={() => setLightbox(false)} style={{
            position: 'absolute', top: 20, right: 28, color: 'var(--gold)',
            fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer',
          }}>✕</button>
          <img src={currentPhoto.url} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .page > div:nth-child(2) > div[style*="grid"] { grid-template-columns:1fr!important; gap:40px!important; padding:40px 20px!important; }
          .page > div:first-child { padding:16px 20px!important; }
        }
      `}</style>
    </div>
  );
}
