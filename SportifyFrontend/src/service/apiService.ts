import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Authentication
export async function login(credentials: { email: string; password: string }) {
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function register(data: any) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function requestPasswordReset(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

export async function verifyOTP(payload: { email: string; otp: string }) {
  const res = await api.post('/auth/verify-otp', payload);
  return res.data;
}

// User / Profile
export async function getProfile(userId?: string) {
  const path = userId ? `/users/${userId}` : '/users/me';
  const res = await api.get(path);
  return res.data;
}

export async function updateProfile(data: any) {
  const res = await api.put('/users/me', data);
  return res.data;
}

// Home / Events / Teams
export async function getHomeData(params?: any) {
  const res = await api.get('/home', { params });
  return res.data;
}

export async function getEvents(params?: any) {
  const res = await api.get('/events', { params });
  return res.data;
}

export async function getEventDetail(eventId: string) {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
}

export async function getTeamList(params?: any) {
  const res = await api.get('/teams', { params });
  return res.data;
}

// Fields / Booking
export async function getFields(params?: any) {
  const res = await api.get('/fields', { params });
  return res.data;
}

export async function getFieldDetail(fieldId: string) {
  const res = await api.get(`/fields/${fieldId}`);
  return res.data;
}

export async function bookField(data: any) {
  const res = await api.post('/bookings', data);
  return res.data;
}

// Products / Payments
export async function getProducts(params?: any) {
  const res = await api.get('/products', { params });
  return res.data;
}

export async function getProductDetail(productId: string) {
  const res = await api.get(`/products/${productId}`);
  return res.data;
}

export async function createPayment(data: any) {
  const res = await api.post('/payments', data);
  return res.data;
}

export async function getPaymentStatus(paymentId: string) {
  const res = await api.get(`/payments/${paymentId}`);
  return res.data;
}

// Static pages / Contact
export async function getPolicy() {
  const res = await api.get('/static/policy');
  return res.data;
}

export async function getRegulations() {
  const res = await api.get('/static/regulations');
  return res.data;
}

export async function sendContactMessage(data: any) {
  const res = await api.post('/contacts', data);
  return res.data;
}

export default api;
