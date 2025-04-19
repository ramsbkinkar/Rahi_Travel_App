import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse, LoginRequest, LoginResponse, TravelPackage, PackageFilters } from './types';

const API_BASE_URL = 'http://192.168.31.185:3000/api';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token on authentication error
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

class ApiClient {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async getPackages(filters?: PackageFilters): Promise<TravelPackage[]> {
    try {
      const response: AxiosResponse<TravelPackage[]> = await axiosInstance.get('/packages', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      throw error;
    }
  }

  async getPackageById(id: string): Promise<TravelPackage> {
    try {
      const response: AxiosResponse<TravelPackage> = await axiosInstance.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch package ${id}:`, error);
      throw error;
    }
  }

  async createPackage(packageData: Omit<TravelPackage, 'id' | 'created_at' | 'updated_at'>): Promise<TravelPackage> {
    try {
      const response: AxiosResponse<TravelPackage> = await axiosInstance.post('/packages', packageData);
      return response.data;
    } catch (error) {
      console.error('Failed to create package:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient; 