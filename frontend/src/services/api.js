const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const getPortfolios = async (category = '') => {
  const url = category ? `${API_URL}/portfolio?category=${category}` : `${API_URL}/portfolio`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch portfolio items');
  return res.json();
};

export const getGallery = async (category = '') => {
  const url = category && category !== 'All' ? `${API_URL}/gallery?category=${category}` : `${API_URL}/gallery`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch gallery items');
  return res.json();
};

export const getBlogs = async (category = '', search = '') => {
  let url = `${API_URL}/blogs?`;
  if (category) url += `category=${category}&`;
  if (search) url += `search=${search}&`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
};

export const getBlogBySlug = async (slug) => {
  const res = await fetch(`${API_URL}/blogs/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch blog post');
  return res.json();
};

export const getTestimonials = async () => {
  const res = await fetch(`${API_URL}/testimonials`);
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
};

export const getTeam = async () => {
  const res = await fetch(`${API_URL}/team`);
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
};

export const getPricing = async () => {
  const res = await fetch(`${API_URL}/pricing`);
  if (!res.ok) throw new Error('Failed to fetch pricing plans');
  return res.json();
};

export const getFAQs = async () => {
  const res = await fetch(`${API_URL}/faqs`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
};

export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch website settings');
  return res.json();
};

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
