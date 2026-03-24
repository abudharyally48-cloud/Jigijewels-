import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import { useTrackVisit } from '../hooks/useTrackVisit';
import ProductCard from '../components/ProductCard';

export default function Home() {
  useTrackVisit();
  const [featured, setFeatured] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true }),
      getProducts({}),
    ]).then(([f, a]) => {
      setFeatured(f.data.slice(0, 3));
      setAll(a.data.slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* HERO */}
      <section style={{
        minHeight: '100vh', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        overflow: 'hidden', padding: 0,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=85') center/cover",
          filter: 'brightness(0.12) saturate(0.8)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(201,151,58,0.05) 0%, transparent 70%)',
        }} />
        {/* Decorative rings */}
        {[600, 800, 1000].map(size => (
          <div key={size} style={{
            position: 'absolute', width: size, height: size,
            border: `1px solid rgba(201,151,58,${size === 600 ? 0.07 : 0.03})`,
            borderRadius: '50%', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, padding: '0 24px' }}>
          <div className="fade-up" style={{
            fontSize: '1.2rem', letterSpacing: 6, color: 'var(--gold)', marginBottom: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <span style={{ width: 48, height: 1, background: 'linear-gradient(to right,transparent,var(--gold))', display: 'inline-block' }} />
            ◆ Enugu, Nigeria ◆
            <span style={{ width: 48, height: 1, background: 'linear-gradient(to left,transparent,var(--gold))', display: 'inline-block' }} />
          </div>
          <h1 className="fade-up delay-1" style={{
            fontFamily: 'Cinzel,serif', fontSize: 'clamp(3.5rem,10vw,9rem)',
            fontWeight: 700, lineHeight: 0.9, letterSpacing: 6,
            textTransform: 'uppercase', color: 'var(--cream)', marginBottom: 10,
          }}>JIGI</h1>
          <div className="fade-up delay-2" style={{
            fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.8rem,4vw,3.5rem)',
            fontWeight: 400, letterSpacing: 14, textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 36,
          }}>Jewels</div>
          <p className="fade-up delay-3" style={{
            color: 'rgba(248,240,227,0.35)', fontSize: '0.8rem', fontWeight: 200,
            lineHeight: 2, letterSpacing: 3, textTransform: 'uppercase',
            maxWidth: 480, margin: '0 auto 48px',
          }}>Handcrafted luxury jewelry · Bracelets · Necklaces · Earrings · Sets</p>
          <div className="fade-up delay-4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-gold">Shop the Collection</Link>
            <Link to="/about" className="btn-outline">Our Story</Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: 'var(--gold)', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', animation: 'marq 28s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(2)].map((_, ri) =>
            ['Handcrafted Jewelry','Bracelets','Necklace Sets','Earrings','Luxury Pieces','Enugu Nigeria','Jigi Jewels'].map((t, i) => (
              <span key={`${ri}-${i}`}>
                <span style={{ fontFamily:'Cinzel,serif', fontSize:'0.72rem', letterSpacing:6, textTransform:'uppercase', color:'var(--bg)', padding:'0 28px', fontWeight:600 }}>{t}</span>
                <span style={{ color:'rgba(10,8,6,0.35)', padding:'0 6px' }}>◆</span>
              </span>
            ))
          )}
        </div>
        <style>{`@keyframes marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* FEATURED */}
      {!loading && featured.length > 0 && (
        <section style={{ padding: '100px 80px', background: 'var(--bg2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Curated For You</div>
            <h2 className="section-title">Featured <em>Pieces</em></h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3, maxWidth: 1200, margin: '0 auto',
          }}>
            {featured.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/shop" className="btn-gold">View All Pieces</Link>
          </div>
        </section>
      )}

      {/* ALL PRODUCTS PREVIEW */}
      {!loading && all.length > 0 && (
        <section style={{ padding: '100px 80px', background: 'var(--bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="eyebrow">Our Collections</div>
              <h2 className="section-title">Pieces That<br /><em>Define You</em></h2>
            </div>
            <Link to="/shop" className="btn-outline" style={{ fontSize: '0.6rem', padding: '12px 28px' }}>View All</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 3, maxWidth: 1300, margin: '0 auto',
          }}>
            {all.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.08} />)}
          </div>
        </section>
      )}

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {/* ABOUT STRIP */}
      <section style={{ padding: '80px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Our Story</div>
        <h2 className="section-title" style={{ marginBottom: 20 }}>Jewelry That<br /><em>Tells Your Story</em></h2>
        <p style={{ color: 'var(--gray)', fontSize: '0.84rem', lineHeight: 2, maxWidth: 560, margin: '0 auto 36px', fontWeight: 300 }}>
          Jigi Jewels is a luxury jewelry brand based in Enugu, Nigeria. Every piece is carefully selected and handcrafted to bring out the beauty of every woman who wears it.
        </p>
        <Link to="/about" className="btn-outline">Learn More</Link>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 80px', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>What They Say</div>
          <h2 className="section-title">Happy <em>Customers</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 2, maxWidth: 1100, margin: '0 auto' }}>
          {[
            { name: 'Adaeze O.', loc: 'Enugu · Necklace Set', text: 'I ordered the pink crystal necklace set and it was even more beautiful in person. The quality is amazing and delivery was fast. I get compliments every time I wear it.' },
            { name: 'Chisom A.', loc: 'Enugu · Charm Bracelet Stack', text: 'The charm bracelet stack I got was perfect. Every piece is so detailed and unique. Jigi Jewels is the only place I buy jewelry from now. Highly recommend.' },
            { name: 'Ngozi M.', loc: 'Enugu · Silver Heart Set', text: 'Ordered as a gift for my sister and she absolutely loved it. The packaging was beautiful and the silver heart set looked expensive and luxurious. Will order again.' },
          ].map((t, i) => (
            <div key={i} style={{
              background: 'var(--bg2)', padding: '36px 30px',
              borderBottom: '1px solid transparent', transition: 'border-color 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
            >
              <div style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: 3, marginBottom: 16 }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', fontWeight: 200, lineHeight: 1.9, color: 'var(--lgray)', marginBottom: 20, fontSize: '0.9rem' }}>"{t.text}"</p>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.75rem', color: 'var(--cream)', letterSpacing: 2 }}>{t.name}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--gray)', marginTop: 3, letterSpacing: 1 }}>{t.loc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER CTA */}
      <section style={{ padding: '100px 80px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Order Now</div>
        <h2 className="section-title" style={{ marginBottom: 16 }}>Find Your<br /><em>Perfect Piece</em></h2>
        <p style={{ color: 'var(--gray)', fontSize: '0.84rem', lineHeight: 2, marginBottom: 48, fontWeight: 300 }}>
          Tap below to order directly on WhatsApp. Tell us what you want and we will make it happen.
        </p>
        <a href="https://wa.me/2348072154424?text=Hi%2C%20I%20would%20like%20to%20shop%20at%20Jigi%20Jewels" target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: '0.72rem', padding: '16px 52px', fontFamily: 'Cinzel,serif' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Shop on WhatsApp
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050301', padding: '64px 80px', borderTop: '1px solid rgba(201,151,58,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 60, marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.3rem', fontWeight: 600, letterSpacing: 5, color: 'var(--cream)', textTransform: 'uppercase', marginBottom: 4 }}>Jigi Jewels</div>
              <div style={{ fontSize: '0.42rem', letterSpacing: 7, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Luxury Jewelry · Enugu</div>
              <p style={{ color: '#3a2e22', fontSize: '0.75rem', lineHeight: 1.8, fontWeight: 300 }}>Handcrafted luxury jewelry for the woman who knows her worth. Based in Enugu, Nigeria.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.5rem', letterSpacing: 5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Navigate</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About']].map(([to, label]) => (
                  <li key={to}><Link to={to} style={{ color: '#2a2018', fontSize: '0.75rem', textDecoration: 'none' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.5rem', letterSpacing: 5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Contact</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><a href="https://wa.me/2348072154424" target="_blank" rel="noreferrer" style={{ color: '#2a2018', fontSize: '0.75rem' }}>08072154424</a></li>
                <li><span style={{ color: '#2a2018', fontSize: '0.75rem' }}>Okpara Avenue, Enugu</span></li>
              </ul>
            </div>
          </div>
          <div style={{ paddingTop: 24, borderTop: '1px solid rgba(201,151,58,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ color: '#180e06', fontSize: '0.6rem', letterSpacing: 1 }}>© 2025 Jigi Jewels · Enugu, Nigeria</span>
            <span style={{ color: '#180e06', fontSize: '0.6rem' }}>◆ Made with love</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
