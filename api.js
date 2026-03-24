import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token to admin requests
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jigi_admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/meta/categories');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadPhotos = (id, formData) =>
  api.post(`/products/${id}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePhoto = (productId, photoId) => api.delete(`/products/${productId}/photos/${photoId}`);
export const setPrimaryPhoto = (productId, photoId) => api.put(`/products/${productId}/photos/${photoId}/primary`);

// Auth
export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const verifyToken = () => api.get('/auth/verify');

// Visitors
export const trackVisit = (page) => api.post('/visitors/track', { page });
export const getVisitorStats = () => api.get('/visitors/stats');

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getOrders = (params) => api.get('/orders', { params });
export const getOrderStats = () => api.get('/orders/stats');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
