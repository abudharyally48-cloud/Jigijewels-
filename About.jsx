import { Link } from 'react-router-dom';
import { useTrackVisit } from '../hooks/useTrackVisit';

export default function About() {
  useTrackVisit();

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div style={{
        padding: '100px 80px 80px', background: 'var(--bg2)',
        borderBottom: '1px solid rgba(201,151,58,0.08)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
        maxWidth: 1300, margin: '0 auto',
      }}>
        <div className="fade-up">
          <div className="eyebrow">Our Story</div>
          <h1 className="section-title" style={{ marginBottom: 24 }}>Jewelry That<br /><em>Tells Your Story</em></h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 2.1, fontWeight: 300, marginBottom: 16 }}>
            Jigi Jewels is a luxury jewelry brand based in Enugu, Nigeria. Every piece in our collection is carefully selected and handcrafted to bring out the beauty and personality of every woman who wears it.
          </p>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 2.1, fontWeight: 300, marginBottom: 32 }}>
            From elegant necklace sets to playful charm bracelets — each piece is a statement. We believe jewelry is not just an accessory. It is an expression of who you are.
          </p>
          <div style={{ width: 48, height: 1, background: 'var(--gold)', marginBottom: 32 }} />
          <div style={{ background: 'var(--bg3)', borderLeft: '2px solid var(--gold)', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.5rem', letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Find Us</div>
            <div style={{ color: 'var(--lgray)', fontSize: '0.8rem', lineHeight: 1.8 }}>
              Okpara Avenue, Enugu 400102<br />
              Enugu State, Nigeria<br /><br />
              <a href="https://wa.me/2348072154424" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>WhatsApp: 08072154424</a>
            </div>
          </div>
        </div>

        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
            'https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=600&q=80',
            'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
          ].map((src, i) => (
            <img key={i} src={src} alt="Jewelry" style={{
              width: '100%', height: i === 0 ? 280 : 180, objectFit: 'cover',
              filter: 'saturate(0.7) brightness(0.7)', display: 'block',
              gridRow: i === 0 ? 'span 2' : 'auto',
              transition: 'filter 0.5s',
            }}
              onMouseEnter={e => e.target.style.filter = 'saturate(0.9) brightness(0.85)'}
              onMouseLeave={e => e.target.style.filter = 'saturate(0.7) brightness(0.7)'}
            />
          ))}
        </div>
      </div>

      {/* Values */}
      <section style={{ padding: '100px 80px', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>What We Stand For</div>
          <h2 className="section-title">Our <em>Values</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 2, maxWidth: 1000, margin: '0 auto' }}>
          {[
            { icon: '◈', title: 'Craftsmanship', desc: 'Every piece is handcrafted with precision. We take pride in the details that make each jewelry unique.' },
            { icon: '◇', title: 'Quality', desc: 'We source only premium materials. Quality is not an option at Jigi Jewels — it is a standard.' },
            { icon: '◆', title: 'Expression', desc: 'Jewelry is personal. We believe every woman deserves pieces that speak her story.' },
            { icon: '◉', title: 'Care', desc: 'From selection to delivery, we handle every order with care and personal attention.' },
          ].map((v, i) => (
            <div key={i} style={{
              background: 'var(--bg2)', padding: '40px 28px', textAlign: 'center',
              borderBottom: '2px solid transparent', transition: 'border-color 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
            >
              <div style={{ fontSize: '1.6rem', color: 'var(--gold)', marginBottom: 18 }}>{v.icon}</div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.9rem', letterSpacing: 3, color: 'var(--cream)', marginBottom: 14, textTransform: 'uppercase' }}>{v.title}</div>
              <p style={{ color: 'var(--gray)', fontSize: '0.78rem', lineHeight: 1.9, fontWeight: 300 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Ready to Shop?</div>
        <h2 className="section-title" style={{ marginBottom: 36 }}>Find Your <em>Perfect Piece</em></h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" className="btn-gold">Browse Collection</Link>
          <a href="https://wa.me/2348072154424" target="_blank" rel="noreferrer" className="btn-outline">Chat on WhatsApp</a>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          .page > div:first-child { grid-template-columns:1fr!important; padding:60px 20px!important; }
          section { padding:60px 20px!important; }
        }
      `}</style>
    </div>
  );
}
