import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/auth`;

// Configure axios to send cookies
axios.defaults.withCredentials = true;

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};