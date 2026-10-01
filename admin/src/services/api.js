import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Bearer token to request headers automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clicksansar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateAdminProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

// Services API
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const createService = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/services', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateService = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(`/services/${id}`, formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// Leads & Inquiries API
export const getLeads = async () => {
  const response = await api.get('/leads');
  return response.data;
};

export const updateLeadStatus = async (id, status) => {
  const response = await api.put(`/leads/${id}/status`, { status });
  return response.data;
};

export const confirmPaymentAndReleaseKey = async (id, data = {}) => {
  const response = await api.put(`/leads/${id}/confirm-payment`, data);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

// Settings API
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put('/settings', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

// Standalone Image Upload API
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default api;
