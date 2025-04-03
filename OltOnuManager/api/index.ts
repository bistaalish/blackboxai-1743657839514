import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OLTDevice, ONUDevice } from '../types/devices';

const api = axios.create({
  baseURL: 'https://api.olt-onu-manager.com/v1', // Replace with your actual API URL
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('authToken');
      // TODO: Redirect to login screen
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
};

export const deviceAPI = {
  getOLTDevices: async () => {
    const response = await api.get('/devices/olts');
    return response.data;
  },
  getONUDevices: async (oltId: string) => {
    const response = await api.get(`/devices/onus?oltId=${oltId}`);
    return response.data;
  },
  updateDeviceConfig: async (deviceId: string, config: object) => {
    const response = await api.put(`/devices/${deviceId}`, config);
    return response.data;
  },
};

export default api;