import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api';
import { useTrackVisit } from '../hooks/useTrackVisit';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  useTrackVisit();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory ? { category: activeCategory } : {})
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', padding: '80px 80px 60px',
        borderBottom: '1px solid rgba(201,151,58,0.08)',
      }}>
        <div className="eyebrow">All Pieces</div>
        <h1 className="section-title">The <em>Collection</em></h1>
        <p style={{ color: 'var(--gray)', fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.8, marginTop: 12, maxWidth: 500 }}>
          Every piece handcrafted with care. Browse and order directly on WhatsApp.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        padding: '28px 80px', background: 'var(--bg3)',
        borderBottom: '1px solid rgba(201,151,58,0.06)',
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ color: 'var(--gray)', fontSize: '0.55rem', letterSpacing: 4, textTransform: 'uppercase' }}>Filter:</span>
        {['', ...categories].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? 'var(--gold)' : 'none',
            color: activeCategory === cat ? 'var(--bg)' : 'var(--gray)',
            border: `1px solid ${activeCategory === cat ? 'var(--gold)' : 'rgba(201,151,58,0.2)'}`,
            padding: '7px 18px', fontSize: '0.58rem', letterSpacing: 3,
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s',
            fontFamily: 'Raleway,sans-serif',
          }}>{cat || 'All'}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '60px 80px' }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1rem', letterSpacing: 3, marginBottom: 12 }}>No Pieces Found</div>
            <p style={{ fontSize: '0.75rem' }}>Try a different category or check back soon.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
          }}>
            {products.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.06} />)}
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          .page > div { padding-left: 20px!important; padding-right: 20px!important; }
        }
      `}</style>
    </div>
  );
}
