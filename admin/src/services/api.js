import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

// Blogs API
export const getBlogs = async (params = {}) => {
  const response = await api.get('/blogs', { params });
  return response.data;
};

export const createBlog = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/blogs', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(`/blogs/${id}`, formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

// Portfolio API
export const getPortfolios = async (category = '') => {
  const response = await api.get('/portfolio', { params: { category } });
  return response.data;
};

export const createPortfolio = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/portfolio', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updatePortfolio = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(`/portfolio/${id}`, formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deletePortfolio = async (id) => {
  const response = await api.delete(`/portfolio/${id}`);
  return response.data;
};

// Gallery API
export const getGallery = async (category = '') => {
  const response = await api.get('/gallery', { params: { category } });
  return response.data;
};

export const createGallery = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/gallery', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteGallery = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};

// Testimonials API
export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

export const createTestimonial = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/testimonials', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateTestimonial = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(`/testimonials/${id}`, formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};

// Team API
export const getTeam = async () => {
  const response = await api.get('/team');
  return response.data;
};

export const createTeam = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/team', formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateTeam = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(`/team/${id}`, formData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteTeam = async (id) => {
  const response = await api.delete(`/team/${id}`);
  return response.data;
};

// Pricing API
export const getPricing = async () => {
  const response = await api.get('/pricing');
  return response.data;
};

export const createPricing = async (data) => {
  const response = await api.post('/pricing', data);
  return response.data;
};

export const updatePricing = async (id, data) => {
  const response = await api.put(`/pricing/${id}`, data);
  return response.data;
};

export const deletePricing = async (id) => {
  const response = await api.delete(`/pricing/${id}`);
  return response.data;
};

// FAQs API
export const getFAQs = async () => {
  const response = await api.get('/faqs');
  return response.data;
};

export const createFAQ = async (data) => {
  const response = await api.post('/faqs', data);
  return response.data;
};

export const updateFAQ = async (id, data) => {
  const response = await api.put(`/faqs/${id}`, data);
  return response.data;
};

export const deleteFAQ = async (id) => {
  const response = await api.delete(`/faqs/${id}`);
  return response.data;
};

// Leads API
export const getLeads = async () => {
  const response = await api.get('/leads');
  return response.data;
};

export const updateLeadStatus = async (id, status) => {
  const response = await api.put(`/leads/${id}/status`, { status });
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
