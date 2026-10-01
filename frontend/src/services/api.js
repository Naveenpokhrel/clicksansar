const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Services
export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
};

export const getServiceBySlug = async (slug) => {
  const res = await fetch(`${API_URL}/services/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch service detail');
  return res.json();
};

// Website Settings
export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch website settings');
  return res.json();
};

// Leads & Inquiries
export const submitLead = async (leadData) => {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit inquiry');
  }
  return data;
};

export const lookupOrder = async (orderNumber) => {
  const res = await fetch(`${API_URL}/leads/lookup/${orderNumber}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
};

export const cancelOrderByNumber = async (orderNumber) => {
  const res = await fetch(`${API_URL}/leads/order/${orderNumber}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
  return data;
};

export const deleteMyOrder = async (orderId, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_URL}/leads/my-order/${orderId}`, {
    method: 'DELETE',
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete order');
  return data;
};

// Chatbot Assistant
export const sendMessageToChatbot = async (message) => {
  const res = await fetch(`${API_URL}/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to get chatbot response');
  return res.json();
};

// Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
};

// Client Authentication & Portal
export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create account');
  return data;
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to sign in');
  return data;
};

export const getUserProfile = async (token) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user profile');
  return data;
};

export const updateUserProfile = async (userData, token) => {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

export const getMyOrders = async (token) => {
  const res = await fetch(`${API_URL}/auth/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data;
};
