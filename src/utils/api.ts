export const API_BASE_URL = 'http://localhost:5002/api';

export const apiEndpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  forms: {
    getAll: `${API_BASE_URL}/forms`,
    create: `${API_BASE_URL}/forms`,
    getById: (id: string) => `${API_BASE_URL}/forms/${id}`,
    update: (id: string) => `${API_BASE_URL}/forms/${id}`,
    delete: (id: string) => `${API_BASE_URL}/forms/${id}`,
  },
  health: `${API_BASE_URL}/health`,
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};