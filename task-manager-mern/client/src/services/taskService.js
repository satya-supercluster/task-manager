import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/tasks`;

axios.defaults.withCredentials = true;

export const getAllTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getTask = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getTasksByStatus = async (status) => {
  const response = await axios.get(`${API_URL}/status/${status}`);
  return response.data;
};