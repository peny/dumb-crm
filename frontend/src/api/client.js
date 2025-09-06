import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear any cached data and redirect to login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
    
    // If the response has data, return it; otherwise return the error message
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  }
);

// Customer API
export const customerAPI = {
  getAll: () => apiClient.get('/api/customers'),
  getById: (id) => apiClient.get(`/api/customers/${id}`),
  create: (data) => apiClient.post('/api/customers', data),
  update: (id, data) => apiClient.put(`/api/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/api/customers/${id}`),
  search: (query) => apiClient.get(`/api/customers/search?q=${encodeURIComponent(query)}`),
};

// Contact API
export const contactAPI = {
  getAll: () => apiClient.get('/api/contacts'),
  getById: (id) => apiClient.get(`/api/contacts/${id}`),
  getByCustomerId: (customerId) => apiClient.get(`/api/contacts/customer/${customerId}`),
  create: (data) => apiClient.post('/api/contacts', data),
  update: (id, data) => apiClient.put(`/api/contacts/${id}`, data),
  delete: (id) => apiClient.delete(`/api/contacts/${id}`),
};

// Deal API
export const dealAPI = {
  getAll: () => apiClient.get('/api/deals'),
  getById: (id) => apiClient.get(`/api/deals/${id}`),
  getByCustomerId: (customerId) => apiClient.get(`/api/deals/customer/${customerId}`),
  getByStatus: (status) => apiClient.get(`/api/deals/status/${status}`),
  getStats: () => apiClient.get('/api/deals/stats'),
  create: (data) => apiClient.post('/api/deals', data),
  update: (id, data) => apiClient.put(`/api/deals/${id}`, data),
  delete: (id) => apiClient.delete(`/api/deals/${id}`),
};

// Auth API
export const authAPI = {
  login: (email, password) => apiClient.post('/api/auth/login', { email, password }),
  logout: () => apiClient.post('/api/auth/logout'),
  me: () => apiClient.get('/api/auth/me'),
  changePassword: (currentPassword, newPassword) => 
    apiClient.post('/api/auth/change-password', { currentPassword, newPassword }),
  register: (userData) => apiClient.post('/api/auth/register', userData),
};

// User API (admin only)
export const userAPI = {
  getAll: () => apiClient.get('/api/users'),
  getById: (id) => apiClient.get(`/api/users/${id}`),
  create: (data) => apiClient.post('/api/users', data),
  update: (id, data) => apiClient.put(`/api/users/${id}`, data),
  delete: (id) => apiClient.delete(`/api/users/${id}`),
  getStats: () => apiClient.get('/api/users/stats'),
  toggleStatus: (id) => apiClient.post(`/api/users/${id}/toggle-status`),
};

// Health check
export const healthAPI = {
  check: () => apiClient.get('/health'),
};

// Utility function to clear all cached data
export const clearAllCache = () => {
  localStorage.clear();
  sessionStorage.clear();
  // Clear any axios cache if it exists
  if (apiClient.defaults.cache) {
    apiClient.defaults.cache.clear();
  }
};

export default apiClient;
