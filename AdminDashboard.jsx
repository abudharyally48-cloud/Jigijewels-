import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  uploadPhotos, deletePhoto, setPrimaryPhoto,
  getOrders, getOrderStats, updateOrderStatus, deleteOrder,
  getVisitorStats,
} from '../api';

const TABS = ['Products', 'Orders', 'Visitors'];
const CATEGORIES = ['Bracelets', 'Necklace Sets', 'Earrings', 'Sets', 'Rings', 'Other'];
const STATUS_COLORS = { new: '#E8B84B', contacted: '#3b9eff', completed: '#25D366', cancelled: '#e63946' };

function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,151,58,0.15)', color: 'var(--cream)', padding: '10px 14px', fontSize: '0.82rem', outline: 'none', fontFamily: 'Raleway,sans-serif' }} />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        style={{ width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,151,58,0.15)', color: 'var(--cream)', padding: '10px 14px', fontSize: '0.82rem', outline: 'none', fontFamily: 'Raleway,sans-serif', resize: 'vertical' }} />
    </div>
  );
}

// ── PRODUCT FORM MODAL ──────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Bracelets',
    whatsapp_text: product?.whatsapp_text || '',
    is_featured: product?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.category) return setError('Name and category required');
    setSaving(true); setError('');
    try {
      const waText = form.whatsapp_text || `Hi, I would like to order ${form.name} from Jigi Jewels. Can you help me?`;
      const payload = { ...form, whatsapp_text: waText };
      if (product?.id) await updateProduct(product.id, payload);
      else await createProduct(payload);
      onSaved();
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: 'var(--bg2)', maxWidth: 520, width: '100%', padding: '36px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: '1rem', letterSpacing: 3, color: 'var(--cream)' }}>
            {product ? 'Edit Product' : 'New Product'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>
        <Input label="Product Name *" value={form.name} onChange={set('name')} placeholder="e.g. Pink Crystal Set" />
        <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Describe this piece..." rows={3} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Category *</label>
          <select value={form.category} onChange={e => set('category')(e.target.value)}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid rgba(201,151,58,0.15)', color: 'var(--cream)', padding: '10px 14px', fontSize: '0.82rem', outline: 'none', fontFamily: 'Raleway,sans-serif' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Textarea label="Custom WhatsApp Message (optional)" value={form.whatsapp_text} onChange={set('whatsapp_text')} placeholder="Leave blank to auto-generate" rows={2} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 24, fontSize: '0.78rem', color: 'var(--lgray)' }}>
          <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured')(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--gold)' }} />
          Mark as Featured (shows on homepage)
        </label>
        {error && <p style={{ color: 'var(--red)', fontSize: '0.7rem', marginBottom: 14 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving} className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
            {saving ? 'Saving...' : 'Save Product'}
          </button>
          <button onClick={onClose} className="btn-outline" style={{ padding: '12px 20px' }}>Cancel</button>
        </div>
      </div>
    </Overlay>
  );
}

// ── PHOTO MANAGER MODAL ──────────────────────────────
function PhotoModal({ product, onClose, onSaved }) {
  const [photos, setPhotos] = useState(product.photos || []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const refresh = () => {
    import('../api').then(({ getProduct }) => {
      getProduct(product.id).then(r => { setPhotos(r.data.photos); onSaved(); });
    });
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('photos', f));
    setUploading(true);
    try {
      await uploadPhotos(product.id, fd);
      refresh();
    } catch { alert('Upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDelete = async (photoId) => {
    if (!confirm('Delete this photo?')) return;
    await deletePhoto(product.id, photoId);
    refresh();
  };

  const handlePrimary = async (photoId) => {
    await setPrimaryPhoto(product.id, photoId);
    refresh();
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: 'var(--bg2)', maxWidth: 620, width: '100%', padding: '36px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: '1rem', letterSpacing: 3, color: 'var(--cream)' }}>Photos · {product.name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Upload zone */}
        <div onClick={() => fileRef.current.click()} style={{
          border: '2px dashed rgba(201,151,58,0.25)', padding: '32px', textAlign: 'center',
          cursor: 'pointer', marginBottom: 24, transition: 'border-color 0.3s',
          background: 'var(--bg3)',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,151,58,0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,151,58,0.25)'}
        >
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>📷</div>
          <div style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            {uploading ? 'Uploading...' : 'Click to Upload Photos'}
          </div>
          <div style={{ color: 'var(--gray)', fontSize: '0.65rem' }}>JPG, PNG, WEBP · Max 10MB each · Multiple allowed</div>
        </div>

        {/* Photo grid */}
        {photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8 }}>
            {photos.map(ph => (
              <div key={ph.id} style={{ position: 'relative', background: 'var(--bg3)' }}>
                <img src={ph.url} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                {ph.is_primary && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6, background: 'var(--gold)',
                    color: 'var(--bg)', fontSize: '0.42rem', letterSpacing: 2,
                    padding: '3px 7px', textTransform: 'uppercase', fontWeight: 700,
                  }}>Main</div>
                )}
                <div style={{ display: 'flex', gap: 1, marginTop: 1 }}>
                  {!ph.is_primary && (
                    <button onClick={() => handlePrimary(ph.id)} style={{
                      flex: 1, background: 'var(--bg4)', color: 'var(--gold)', border: 'none',
                      padding: '6px 4px', fontSize: '0.5rem', cursor: 'pointer', letterSpacing: 1,
                    }}>Set Main</button>
                  )}
                  <button onClick={() => handleDelete(ph.id)} style={{
                    flex: ph.is_primary ? 2 : 1, background: 'rgba(230,57,70,0.15)',
                    color: 'var(--red)', border: 'none', padding: '6px 4px',
                    fontSize: '0.5rem', cursor: 'pointer',
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.75rem', padding: '20px 0' }}>No photos yet. Upload some above.</p>
        )}

        <button onClick={onClose} className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>Done</button>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,3,1,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      backdropFilter: 'blur(8px)',
    }}>
      {children}
    </div>
  );
}

// ── PRODUCTS TAB ──────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | { product }
  const [photoModal, setPhotoModal] = useState(null);

  const load = () => {
    setLoading(true);
    getProducts({}).then(r => setProducts(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This will also delete all photos.`)) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.1rem', color: 'var(--cream)', letterSpacing: 2 }}>Products</div>
          <div style={{ color: 'var(--gray)', fontSize: '0.7rem', marginTop: 4 }}>{products.length} pieces in the collection</div>
        </div>
        <button onClick={() => setModal('create')} className="btn-gold">+ Add Product</button>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 3 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'var(--bg2)', border: '1px solid rgba(201,151,58,0.06)', overflow: 'hidden', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,151,58,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,151,58,0.06)'}
            >
              {p.primary_photo ? (
                <img src={p.primary_photo} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', filter: 'saturate(0.8) brightness(0.7)' }} />
              ) : (
                <div style={{ width: '100%', height: 180, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--gray)', fontSize: '0.55rem', letterSpacing: 3 }}>NO IMAGE</span>
                </div>
              )}
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.9rem', color: 'var(--cream)', letterSpacing: 1, flex: 1 }}>{p.name}</div>
                  {p.is_featured && <span style={{ background: 'var(--gold)', color: 'var(--bg)', fontSize: '0.4rem', letterSpacing: 2, padding: '3px 7px', textTransform: 'uppercase', marginLeft: 8, whiteSpace: 'nowrap' }}>Featured</span>}
                </div>
                <div style={{ fontSize: '0.55rem', letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>{p.category}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--gray)', marginBottom: 16 }}>{p.photo_count || 0} photo{p.photo_count !== 1 ? 's' : ''}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPhotoModal(p)} style={{ flex: 1, background: 'rgba(201,151,58,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,151,58,0.2)', padding: '8px', fontSize: '0.6rem', cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.target.style.background='rgba(201,151,58,0.2)'; }}
                    onMouseLeave={e => { e.target.style.background='rgba(201,151,58,0.1)'; }}
                  >📷 Photos</button>
                  <button onClick={() => setModal(p)} style={{ flex: 1, background: 'var(--bg3)', color: 'var(--lgray)', border: '1px solid rgba(201,151,58,0.1)', padding: '8px', fontSize: '0.6rem', cursor: 'pointer', letterSpacing: 1 }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--red)', border: '1px solid rgba(230,57,70,0.2)', padding: '8px 12px', fontSize: '0.7rem', cursor: 'pointer' }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
      {photoModal && (
        <PhotoModal
          product={photoModal}
          onClose={() => setPhotoModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

// ── ORDERS TAB ────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      getOrders(filter ? { status: filter } : {}),
      getOrderStats(),
    ]).then(([o, s]) => { setOrders(o.data); setStats(s.data); }).finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    await deleteOrder(id);
    load();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.1rem', color: 'var(--cream)', letterSpacing: 2, marginBottom: 20 }}>Orders</div>
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 3, marginBottom: 24 }}>
            {[
              { label: 'Total', val: stats.total },
              ...stats.byStatus.map(s => ({ label: s.status, val: s.count })),
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg2)', padding: '18px 20px', borderLeft: `3px solid ${STATUS_COLORS[s.label] || 'var(--gold)'}` }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: '0.5rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gray)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['', 'new', 'contacted', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? 'var(--gold)' : 'none',
              color: filter === s ? 'var(--bg)' : 'var(--gray)',
              border: `1px solid ${filter === s ? 'var(--gold)' : 'rgba(201,151,58,0.2)'}`,
              padding: '6px 16px', fontSize: '0.56rem', letterSpacing: 3,
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Raleway,sans-serif',
            }}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray)' }}>No orders yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: 'var(--bg2)', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', borderLeft: `3px solid ${STATUS_COLORS[o.status] || 'var(--bg3)'}` }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.9rem', color: 'var(--cream)', marginBottom: 6 }}>{o.product_name || 'General Enquiry'}</div>
                {o.customer_name && <div style={{ fontSize: '0.7rem', color: 'var(--lgray)', marginBottom: 3 }}>Customer: {o.customer_name}</div>}
                {o.customer_phone && <div style={{ fontSize: '0.7rem', color: 'var(--lgray)', marginBottom: 3 }}>Phone: {o.customer_phone}</div>}
                <div style={{ fontSize: '0.62rem', color: 'var(--gray)', marginTop: 6 }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={o.status} onChange={e => handleStatus(o.id, e.target.value)}
                  style={{ background: 'var(--bg3)', border: `1px solid ${STATUS_COLORS[o.status] || 'rgba(201,151,58,0.2)'}`, color: STATUS_COLORS[o.status] || 'var(--lgray)', padding: '6px 12px', fontSize: '0.6rem', cursor: 'pointer', fontFamily: 'Raleway,sans-serif', letterSpacing: 2 }}>
                  {['new', 'contacted', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <a href={`https://wa.me/2348072154424?text=${encodeURIComponent(o.message || '')}`} target="_blank" rel="noreferrer"
                  style={{ background: '#25D366', color: '#fff', padding: '6px 14px', fontSize: '0.6rem', letterSpacing: 2, textDecoration: 'none' }}>WhatsApp</a>
                <button onClick={() => handleDelete(o.id)} style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--red)', border: '1px solid rgba(230,57,70,0.2)', padding: '6px 10px', cursor: 'pointer' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── VISITORS TAB ──────────────────────────────────────
function VisitorsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisitorStats().then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!stats) return null;

  return (
    <div>
      <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.1rem', color: 'var(--cream)', letterSpacing: 2, marginBottom: 28 }}>Visitors</div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 3, marginBottom: 40 }}>
        {[
          { label: 'Total Visits', val: stats.total, color: 'var(--gold)' },
          { label: 'Today', val: stats.today, color: '#3b9eff' },
          { label: 'This Week', val: stats.week, color: '#25D366' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg2)', padding: '28px 24px', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: '2rem', color: 'var(--cream)', marginBottom: 6 }}>{s.val}</div>
            <div style={{ fontSize: '0.52rem', letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gray)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top pages */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: 5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>◆ Top Pages</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {stats.topPages.map((p, i) => (
            <div key={i} style={{ background: 'var(--bg2)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.8rem', color: 'var(--cream)', letterSpacing: 1 }}>{p.page_visited}</span>
              <span style={{ background: 'rgba(201,151,58,0.1)', color: 'var(--gold)', padding: '3px 12px', fontSize: '0.65rem', letterSpacing: 2 }}>{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <div style={{ fontSize: '0.6rem', letterSpacing: 5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>◆ Recent Visits</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}>
          {stats.recent.map((v, i) => (
            <div key={i} style={{ background: 'var(--bg2)', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.75rem', color: 'var(--lgray)' }}>{v.page_visited}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>{v.ip_address}</span>
              </div>
              <span style={{ fontSize: '0.58rem', color: 'var(--gray)', whiteSpace: 'nowrap' }}>{new Date(v.visited_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState('Products');
  const { admin, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', borderBottom: '1px solid rgba(201,151,58,0.12)',
        padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1rem', letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase' }}>
            ◆ Jigi Jewels
          </div>
          <span style={{ color: 'rgba(201,151,58,0.3)', fontSize: '0.8rem' }}>|</span>
          <div style={{ fontSize: '0.55rem', letterSpacing: 3, color: 'var(--gray)', textTransform: 'uppercase' }}>Admin Dashboard</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--gray)', fontSize: '0.65rem', letterSpacing: 1 }}>Logged in as {admin?.username}</span>
          <Link to="/" target="_blank" style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: 2, textDecoration: 'none' }}>View Site ↗</Link>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(201,151,58,0.2)', color: 'var(--gray)', padding: '7px 16px', fontSize: '0.58rem', letterSpacing: 2, cursor: 'pointer', fontFamily: 'Raleway,sans-serif' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: 'var(--bg2)', borderRight: '1px solid rgba(201,151,58,0.08)', padding: '32px 0', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              width: '100%', background: tab === t ? 'rgba(201,151,58,0.1)' : 'none',
              color: tab === t ? 'var(--gold)' : 'var(--gray)',
              border: 'none', borderLeft: `3px solid ${tab === t ? 'var(--gold)' : 'transparent'}`,
              padding: '14px 24px', fontSize: '0.62rem', letterSpacing: 4, textTransform: 'uppercase',
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'Raleway,sans-serif',
            }}>
              {t === 'Products' ? '◈' : t === 'Orders' ? '◇' : '◉'} {t}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {tab === 'Products' && <ProductsTab />}
          {tab === 'Orders' && <OrdersTab />}
          {tab === 'Visitors' && <VisitorsTab />}
        </div>
      </div>
    </div>
  );
}
